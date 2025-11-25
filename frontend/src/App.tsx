import { useState } from 'react'
import Carrusel from './components/Carrusel'
import AppNavbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import Footer from './components/Footer'
import { db } from './data/db'
import { useProductSearch } from './hooks/useProductSearch'
import { useCart } from './hooks/useCart'
import './App.css'

function App() {
  const [category, setCategory] = useState<string>('todos')
  const { filtered } = useProductSearch(db)
  const { addToCart, cart, itemCount, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, cartTotal } = useCart()

  // Aplica filtro de categoría sobre el resultado de búsqueda
  const filteredByCategory = category === 'todos'
    ? filtered
    : filtered.filter(p => p.category === category)

  return (
    <>
  <AppNavbar 
    setCategory={setCategory}
    itemCount={itemCount}
    cart={cart}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
    removeFromCart={removeFromCart}
    clearCart={clearCart}
    cartTotal={cartTotal}
  />
      <Carrusel />
      
      {/* Grid de productos */}
      <div className="container my-5">
        <h2 className="mb-4 text-center">En tendencia</h2>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {filteredByCategory.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App
