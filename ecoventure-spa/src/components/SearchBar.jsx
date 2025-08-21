export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-eco"
      aria-label="Search"
    />
  );
}
