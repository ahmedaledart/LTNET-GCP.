export function Ticker() {
  const items = [
    { symbol: "BRENT", price: "82.45", change: "+1.2%", up: true },
    { symbol: "WTI", price: "78.12", change: "+0.8%", up: true },
    { symbol: "GOLD", price: "2,045.10", change: "-0.3%", up: false },
    { symbol: "SILVER", price: "22.80", change: "+0.1%", up: true },
    { symbol: "COPPER", price: "3.85", change: "-1.1%", up: false },
    { symbol: "BALTIC DRY", price: "1,850", change: "+2.5%", up: true },
  ];

  return (
    <div className="bg-primary text-bg-dark py-2 overflow-hidden flex whitespace-nowrap border-b border-border-dark">
      <div className="flex animate-[marquee_20s_linear_infinite] gap-8 px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 font-semibold text-sm">
            <span>{item.symbol}</span>
            <span>{item.price}</span>
            <span className={`flex items-center text-xs ${item.up ? 'text-green-900' : 'text-red-900'}`}>
              <span className="material-symbols-outlined text-[16px]">
                {item.up ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {item.change}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <div key={`dup-${i}`} className="flex items-center gap-2 font-semibold text-sm">
            <span>{item.symbol}</span>
            <span>{item.price}</span>
            <span className={`flex items-center text-xs ${item.up ? 'text-green-900' : 'text-red-900'}`}>
              <span className="material-symbols-outlined text-[16px]">
                {item.up ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
