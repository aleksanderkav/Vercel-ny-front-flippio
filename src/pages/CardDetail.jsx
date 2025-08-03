import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { colors, typography, spacing, borderRadius, shadows, getPriceColor, formatPrice } from '../styles/designSystem'
import { supabase } from '../lib/supabase'
import { scrapeAndInsertCard } from '../lib/cardScraper'

const CardDetail = () => {
  const { slug } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [updatingImage, setUpdatingImage] = useState(false)
  const [showEditButton, setShowEditButton] = useState(true)

  useEffect(() => {
    loadCardDetails()
    // Reset image states when card changes
    setImageLoaded(false)
    setImageError(false)
    setIsEditing(false)
    setEditData({})
  }, [slug])

  const loadCardDetails = async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading card details for slug:', slug)
      
      // Convert slug back to searchable name
      const searchName = slug.replace(/-/g, ' ').toLowerCase()
      console.log('🔍 Searching for card with name:', searchName)
      
      // Find card by name
      const { data: cards, error: cardError } = await supabase
        .from('cards')
        .select(`
          id,
          name,
          latest_price,
          price_entries_count,
          category,
          card_type,
          set_name,
          year,
          grading,
          rarity,
          serial_number,
          image_url,
          created_at,
          last_updated
        `)
        .ilike('name', `%${searchName}%`)
        .limit(1)

      console.log('📦 Cards found:', cards)
      console.log('❌ Card error:', cardError)

      if (cardError || !cards || cards.length === 0) {
        throw new Error('Card not found')
      }

      const card = cards[0]
      console.log('✅ Card found:', card.name)

      // Get price history for this card
      const { data: priceHistory, error: priceError } = await supabase
        .from('price_entries')
        .select(`
          id,
          price,
          source,
          timestamp
        `)
        .eq('card_id', card.id)
        .order('timestamp', { ascending: true })
        .limit(50)

      if (priceError) {
        console.error('Price history error:', priceError)
      }

      // Get latest eBay affiliate link
      const { data: latestEbayEntry, error: ebayError } = await supabase
        .from('price_entries')
        .select('source, price, timestamp')
        .eq('card_id', card.id)
        .eq('source', 'eBay')
        .order('timestamp', { ascending: false })
        .limit(1)

      // Get similar cards based on set_name, grading, or category
      const { data: similarCards, error: similarError } = await supabase
        .from('cards')
        .select(`
          id,
          name,
          latest_price,
          category,
          set_name,
          year,
          grading,
          rarity
        `)
        .or(`set_name.eq.${card.set_name},grading.eq.${card.grading},category.eq.${card.category}`)
        .neq('id', card.id)
        .limit(6)

      if (similarError) {
        console.error('Similar cards error:', similarError)
      }

      // Generate affiliate link
      const affiliateLink = latestEbayEntry && latestEbayEntry.length > 0 
        ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name)}`
        : null

      const cardData = {
        ...card,
        slug: slug,
        price_history: priceHistory || [],
        similar_cards: similarCards || [],
        affiliate_link: affiliateLink,
        ebay_price: latestEbayEntry?.[0]?.price || null,
        ebay_last_updated: latestEbayEntry?.[0]?.timestamp || null
      }

      console.log('📦 Final card data:', cardData)
      setCard(cardData)
      setEditData(cardData)
    } catch (err) {
      console.error('❌ Error loading card details:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditData(card)
    }
    setIsEditing(!isEditing)
  }

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log('💾 Saving card updates:', editData)

      const { error } = await supabase
        .from('cards')
        .update({
          name: editData.name,
          category: editData.category,
          card_type: editData.card_type,
          set_name: editData.set_name,
          year: editData.year,
          grading: editData.grading,
          rarity: editData.rarity,
          serial_number: editData.serial_number,
          image_url: editData.image_url,
          last_updated: new Date().toISOString()
        })
        .eq('id', card.id)

      if (error) {
        throw error
      }

      console.log('✅ Card updated successfully')
      
      // Reload card data to get fresh data
      await loadCardDetails()
      setIsEditing(false)
      
      // Show success message
      alert('✅ Card updated successfully!')
      
    } catch (err) {
      console.error('❌ Error updating card:', err)
      alert(`❌ Error updating card: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateImage = async () => {
    try {
      setUpdatingImage(true)
      console.log('🖼️ Updating image for:', card.name)

      // Use the card search to get a new image
      const result = await scrapeAndInsertCard(card.name)
      
      if (result.success) {
        console.log('✅ Image updated successfully')
        
        // Update the local state with new image
        setCard(prev => ({
          ...prev,
          image_url: result.image_url || prev.image_url
        }))
        setEditData(prev => ({
          ...prev,
          image_url: result.image_url || prev.image_url
        }))
        
        // Reset image states
        setImageLoaded(false)
        setImageError(false)
        
        alert('✅ Image updated successfully!')
      } else {
        throw new Error(result.error || 'Failed to update image')
      }
      
    } catch (err) {
      console.error('❌ Error updating image:', err)
      alert(`❌ Error updating image: ${err.message}`)
    } finally {
      setUpdatingImage(false)
    }
  }

  const formatChartData = (priceHistory) => {
    return priceHistory.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: entry.price,
      source: entry.source
    }))
  }

  const generateSlug = (cardName) => {
    return cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const renderEditableField = (label, field, value, type = 'text', options = null) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            style={editInputStyle}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      }
      
      return (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          style={editInputStyle}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )
    }
    
    return <span style={metadataValueStyle}>{value || 'Unknown'}</span>
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading card details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <h2>Card Not Found</h2>
          <p>{error}</p>
          <Link to="/" style={backButtonStyle}>
            ← Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <h2>Card Not Found</h2>
          <p>The requested card could not be found.</p>
          <Link to="/" style={backButtonStyle}>
            ← Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <Link to="/" style={backButtonStyle}>
          ← Back to Collection
        </Link>
        <div style={headerContentStyle}>
          <h1 style={titleStyle}>
            {isEditing ? (
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                style={editTitleStyle}
                placeholder="Card name"
              />
            ) : (
              card.name
            )}
          </h1>
          
          {/* Edit Controls */}
          <div style={editControlsStyle}>
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  style={saveButtonStyle}
                >
                  {saving ? '💾 Saving...' : '✅ Save Changes'}
                </button>
                <button 
                  onClick={handleEditToggle}
                  style={cancelButtonStyle}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={handleEditToggle}
                style={editButtonStyle}
              >
                ✏️ Edit Card
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={contentStyle}>
        {/* Main Card Info */}
        <div style={mainSectionStyle}>
          <div style={cardOverviewStyle}>
            {/* Card Image - Temporarily Hidden */}
            {/* 
            <div style={imageContainerStyle}>
              {(editData.image_url || card.image_url) ? (
                <img 
                  src={editData.image_url || card.image_url} 
                  alt={card.name}
                  style={cardImageStyle}
                  onError={(e) => {
                    console.log('❌ Image failed to load:', editData.image_url || card.image_url);
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                  onLoad={(e) => {
                    console.log('✅ Image loaded successfully:', editData.image_url || card.image_url);
                    setImageLoaded(true);
                    setImageError(false);
                  }}
                />
              ) : null}
              <div style={{
                ...imagePlaceholderStyle,
                display: ((editData.image_url || card.image_url) && imageLoaded && !imageError) ? 'none' : 'flex'
              }}>
                <div style={imageIconStyle}>🃏</div>
                <p style={imageTextStyle}>Card Image</p>
              </div>
              
              <div style={imageControlsStyle}>
                <button 
                  onClick={handleUpdateImage}
                  disabled={updatingImage}
                  style={updateImageButtonStyle}
                >
                  {updatingImage ? '🔄 Updating...' : '🖼️ Update Image'}
                </button>
                
                {isEditing && (
                  <input
                    type="url"
                    value={editData.image_url || ''}
                    onChange={(e) => handleFieldChange('image_url', e.target.value)}
                    style={imageUrlInputStyle}
                    placeholder="Or enter image URL manually"
                  />
                )}
              </div>
            </div>
            */}

            {/* Card Metadata */}
            <div style={metadataStyle}>
              <div style={metadataGridStyle}>
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Set</label>
                  {renderEditableField('Set', 'set_name', editData.set_name)}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Year</label>
                  {renderEditableField('Year', 'year', editData.year, 'number')}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Grading</label>
                  {renderEditableField('Grading', 'grading', editData.grading, 'select', [
                    'Ungraded', 'PSA 1', 'PSA 2', 'PSA 3', 'PSA 4', 'PSA 5', 
                    'PSA 6', 'PSA 7', 'PSA 8', 'PSA 9', 'PSA 10',
                    'BGS 1', 'BGS 2', 'BGS 3', 'BGS 4', 'BGS 5',
                    'BGS 6', 'BGS 7', 'BGS 8', 'BGS 9', 'BGS 9.5', 'BGS 10'
                  ])}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Category</label>
                  {renderEditableField('Category', 'category', editData.category, 'select', [
                    'Pokemon', 'Magic', 'Yu-Gi-Oh!', 'Basketball', 'Football', 
                    'Baseball', 'Hockey', 'Soccer', 'Other'
                  ])}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Card Type</label>
                  {renderEditableField('Card Type', 'card_type', editData.card_type, 'select', [
                    'Holo', 'Reverse Holo', 'Full Art', 'Secret Rare', 'Ultra Rare',
                    'Common', 'Uncommon', 'Rare', 'Legendary', 'Other'
                  ])}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Rarity</label>
                  {renderEditableField('Rarity', 'rarity', editData.rarity, 'select', [
                    'Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare',
                    'Legendary', 'Mythic', 'Promo', 'Other'
                  ])}
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Serial #</label>
                  {renderEditableField('Serial Number', 'serial_number', editData.serial_number)}
                </div>
              </div>

              {/* Price Information */}
              <div style={priceSectionStyle}>
                <div style={currentPriceStyle}>
                  <label style={priceLabelStyle}>Current Price</label>
                  <div style={{ 
                    ...priceValueStyle, 
                    color: getPriceColor(card.latest_price) 
                  }}>
                    {formatPrice(card.latest_price)}
                  </div>
                </div>

                {card.affiliate_link && (
                  <a 
                    href={card.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={ebayButtonStyle}
                  >
                    🛒 Buy on eBay
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          {card.price_history && card.price_history.length > 1 && (
            <div style={chartSectionStyle}>
              <h3 style={sectionTitleStyle}>Price History</h3>
              <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatChartData(card.price_history)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={colors.textSecondary}
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        boxShadow: shadows.lg
                      }}
                      formatter={(value, name) => [`$${value}`, 'Price']}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={colors.primary}
                      strokeWidth={3}
                      dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Similar Cards */}
        {card.similar_cards && card.similar_cards.length > 0 && (
          <div style={similarSectionStyle}>
            <h3 style={sectionTitleStyle}>Similar Cards</h3>
            <div style={similarGridStyle}>
              {card.similar_cards.map((similarCard) => (
                <Link 
                  key={similarCard.id}
                  to={`/card/${generateSlug(similarCard.name)}`}
                  style={similarCardStyle}
                >
                  <h4 style={similarCardTitleStyle}>{similarCard.name}</h4>
                  <div style={similarCardMetaStyle}>
                    <span>{similarCard.set_name}</span>
                    {similarCard.grading && <span>• {similarCard.grading}</span>}
                  </div>
                  <div style={{ 
                    ...similarCardPriceStyle, 
                    color: getPriceColor(similarCard.latest_price) 
                  }}>
                    {formatPrice(similarCard.latest_price)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: spacing.xl,
  fontFamily: typography.fontFamily.primary,
  background: colors.background,
  minHeight: '100vh'
}

const headerStyle = {
  marginBottom: spacing.xl
}

const backButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  color: colors.textSecondary,
  textDecoration: 'none',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  marginBottom: spacing.md,
  transition: 'color 0.2s ease',
  '&:hover': {
    color: colors.textPrimary
  }
}

const headerContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: spacing.md
}

const titleStyle = {
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  margin: 0,
  lineHeight: typography.lineHeight.tight
}

const editTitleStyle = {
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  margin: 0,
  lineHeight: typography.lineHeight.tight,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  padding: spacing.sm,
  background: colors.surface,
  width: '100%'
}

const editControlsStyle = {
  display: 'flex',
  gap: spacing.sm,
  marginTop: spacing.md
}

const editButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.primary,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  border: 'none',
  cursor: 'pointer'
}

const saveButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.success,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  border: 'none',
  cursor: 'pointer'
}

const cancelButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.danger,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  border: 'none',
  cursor: 'pointer'
}

const contentStyle = {
  display: 'grid',
  gap: spacing.xl
}

const mainSectionStyle = {
  display: 'grid',
  gap: spacing.xl
}

const cardOverviewStyle = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: spacing.xl,
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '400px'
  }

  const cardImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.md
  }

  const imagePlaceholderStyle = {
    width: '100%',
    height: '400px',
    background: colors.surfaceHover,
    borderRadius: borderRadius.md,
    border: `2px dashed ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textSecondary
  }

const imageIconStyle = {
  fontSize: '4rem',
  marginBottom: spacing.sm
}

const imageTextStyle = {
  fontSize: typography.fontSize.sm,
  margin: 0
}

const imageControlsStyle = {
  display: 'flex',
  gap: spacing.sm,
  marginTop: spacing.md
}

const updateImageButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.info,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  border: 'none',
  cursor: 'pointer'
}

const imageUrlInputStyle = {
  flex: 1,
  padding: spacing.sm,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  background: colors.surface,
  color: colors.textPrimary,
  fontSize: typography.fontSize.sm
}

const metadataStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg
}

const metadataGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: spacing.md
}

const metadataItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs
}

const metadataLabelStyle = {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const metadataValueStyle = {
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary
}

const priceSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.lg,
  padding: spacing.lg,
  background: colors.surfaceHover,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`
}

const currentPriceStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs
}

const priceLabelStyle = {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.textSecondary
}

const priceValueStyle = {
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold
}

const ebayButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.primary,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: colors.primaryHover,
    transform: 'translateY(-1px)'
  }
}

const chartSectionStyle = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

const sectionTitleStyle = {
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  margin: 0,
  marginBottom: spacing.lg
}

const chartContainerStyle = {
  width: '100%',
  height: '300px'
}

const similarSectionStyle = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

const similarGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: spacing.md
}

const similarCardStyle = {
  display: 'block',
  padding: spacing.lg,
  background: colors.surfaceHover,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: shadows.lg,
    transform: 'translateY(-2px)',
    borderColor: colors.primary
  }
}

const similarCardTitleStyle = {
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary,
  margin: 0,
  marginBottom: spacing.xs,
  lineHeight: typography.lineHeight.tight
}

const similarCardMetaStyle = {
  fontSize: typography.fontSize.sm,
  color: colors.textSecondary,
  marginBottom: spacing.sm,
  display: 'flex',
  gap: spacing.xs
}

const similarCardPriceStyle = {
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.bold
}

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.xl,
  gap: spacing.lg
}

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: `3px solid ${colors.border}`,
  borderTop: `3px solid ${colors.primary}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}

const errorStyle = {
  textAlign: 'center',
  padding: spacing.xl,
  color: colors.textSecondary
}

const editInputStyle = {
  padding: spacing.sm,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  background: colors.surface,
  color: colors.textPrimary,
  fontSize: typography.fontSize.sm,
  width: '100%'
}

export default CardDetail 