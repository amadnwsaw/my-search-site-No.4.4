import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);

  const fetchSuggestions = async (q) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: q }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowDropdown(true);
    } catch (e) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setKeyword(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (text) => {
    setKeyword(text);
    setShowDropdown(false);
  };

  const handleBlur = () => {
    // 延遲隱藏，讓點擊事件先觸發
    setTimeout(() => setShowDropdown(false), 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('送出搜尋: ' + keyword);
    // 這裡你可以改成真正搜尋行為
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={keyword}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => keyword && setShowDropdown(true)}
          placeholder="請輸入搜尋關鍵字"
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginTop: '10px' }}>
          搜尋
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '42px',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
              }}
              onMouseDown={(e) => e.preventDefault()} // 防止input blur
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
