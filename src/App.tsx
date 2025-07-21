import './App.css'
import menuData from './menuData.json'

function App() {
  const renderPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return `${price}元`
    }
    return price
  }

  return (
    <div className="menu-container">
      <h1 className="menu-title">{menuData.title}</h1>
      
      <div className="menu-content">
        {menuData.categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="menu-section">
            <h2>{category.name}</h2>
            <div className="menu-items">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="menu-item">
                  <span className="item-name">{item.name}</span>
                  <span className="dots"></span>
                  <span className="price">{renderPrice(item.price)}</span>
                  <input type="checkbox" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="menu-footer">
        <p>订餐电话: {menuData.contact.phones.join(' ')}</p>
      </div>
    </div>
  )
}

export default App
