export default function RequestsHeader() {
      const [todayLabel, setTodayLabel] = useState("");
    
      // 🔥 Handle greeting + date
      useEffect(() => {
        const updateDateTime = () => {
          const now = new Date();
          const hours = now.getHours();
        
          // Date formatting
          setTodayLabel(
            now.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        };
    
        updateDateTime();
    
        // Update every minute (handles midnight rollover)
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
      }, []);
    return (
      <div className="req-header">
        <h1 className="req-title">Job Requests</h1>
  
        <div className="req-filters">
          <button className="req-chip">
            Today <span className="req-chev">▾</span>
          </button>
  
          <button className="req-chip">
            {todayLabel}<span className="req-chev">▾</span>
          </button>
        </div>
      </div>
    );
  }
  
