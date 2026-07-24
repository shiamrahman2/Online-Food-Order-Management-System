import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search for food...' }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(value)
      }}
      className="flex items-center bg-white rounded-full shadow-soft px-2 py-2 w-full max-w-xl focus-within:ring-2 focus-within:ring-mango"
    >
      <Search className="text-ink/40 ml-3" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 bg-transparent outline-none text-ink placeholder:text-ink/40"
      />
      <button type="submit" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full px-6 focus-ring">
        Search
      </button>
    </form>
  )
}
