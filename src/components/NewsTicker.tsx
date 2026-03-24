import { useState, useEffect } from 'react';

export function NewsTicker() {
  const [news, setNews] = useState<{title: string, link: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Use allorigins proxy to bypass CORS and fetch BBC Arabic economy page
        const targetUrl = 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t';
        
        let htmlContent = '';
        
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          htmlContent = data.contents;
        } catch (e) {
          console.warn('First proxy failed, trying fallback proxy...', e);
          const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
          if (!response.ok) throw new Error('Fallback proxy failed');
          htmlContent = await response.text();
        }
        
        if (!htmlContent) throw new Error('No content received');

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Find links that look like news articles
        const links = Array.from(doc.querySelectorAll('a'));
        const extractedNews: {title: string, link: string}[] = [];
        
        links.forEach(link => {
          // BBC typically uses h2, h3, or spans for article titles inside links
          const titleElement = link.querySelector('h2, h3, h4, span');
          const titleText = titleElement ? titleElement.textContent?.trim() : link.textContent?.trim();
          const href = link.getAttribute('href');
          
          // Filter for valid article links with reasonable title lengths
          if (titleText && titleText.length > 20 && href && href.includes('/articles/')) {
            const fullLink = href.startsWith('http') ? href : `https://www.bbc.com${href}`;
            
            // Avoid duplicates
            if (!extractedNews.find(n => n.title === titleText)) {
              extractedNews.push({ title: titleText, link: fullLink });
            }
          }
        });
        
        // Take the top 10 unique news items
        if (extractedNews.length > 0) {
          setNews(extractedNews.slice(0, 10));
        } else {
          throw new Error("No news found");
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to static news if all proxies fail
        setNews([
          { title: 'ارتفاع أسعار النفط عالمياً وسط ترقب لقرارات أوبك+', link: 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t' },
          { title: 'توقعات بنمو الاقتصاد العالمي بنسبة 3.1% خلال العام الجاري', link: 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t' },
          { title: 'الذهب يسجل مستويات قياسية جديدة مع تراجع الدولار', link: 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t' },
          { title: 'أسواق الأسهم الأوروبية تغلق على ارتفاع بدعم من قطاع التكنولوجيا', link: 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t' },
          { title: 'تراجع معدلات التضخم في الاقتصادات الكبرى بأسرع من المتوقع', link: 'https://www.bbc.com/arabic/topics/cez1ey7d8l5t' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface-dark border-b border-border-dark py-2 px-6 flex items-center h-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">campaign</span>
          <span className="text-primary font-bold whitespace-nowrap text-sm">أخبار الاقتصاد:</span>
          <span className="text-text-muted text-sm animate-pulse mr-2">جاري تحميل الأخبار...</span>
        </div>
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="bg-surface-dark border-b border-border-dark py-2 px-6 flex items-center h-10 relative overflow-hidden group">
      {/* Title Badge - Absolute positioned to stay on top of scrolling text */}
      <div className="absolute right-0 top-0 bottom-0 bg-surface-dark z-20 flex items-center px-6 shadow-[-10px_0_10px_-5px_rgba(33,29,17,1)]">
        <span className="material-symbols-outlined text-primary text-[20px] ml-2">campaign</span>
        <span className="text-primary font-bold whitespace-nowrap text-sm">أخبار الاقتصاد:</span>
      </div>
      
      {/* Scrolling Container */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center mr-36">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] w-max">
          {/* First set of news */}
          {news.map((item, index) => (
            <div key={index} className="flex items-center inline-flex">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors text-sm font-medium"
              >
                {item.title}
              </a>
              <span className="mx-6 text-border-dark">|</span>
            </div>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {news.map((item, index) => (
            <div key={`dup-${index}`} className="flex items-center inline-flex">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors text-sm font-medium"
              >
                {item.title}
              </a>
              {index < news.length - 1 && (
                <span className="mx-6 text-border-dark">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Left fade out effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-dark to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
