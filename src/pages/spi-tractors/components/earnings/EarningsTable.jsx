const rows = [
    {
      name: "Godwin Adegoke",
      farm: "Meadow Ridge Farm Cultivation",
      size: "15 Acres",
      task: "Tilling the soil",
      amount: "₦150,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Obinna Okwuosa",
      farm: "Horizon Hill Farm Cultivation",
      size: "14 Acres",
      task: "Field preparation",
      amount: "₦600,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Ify Nwosu",
      farm: "Cedar Grove Farm Cultivation",
      size: "30 Acres",
      task: "Breaking ground",
      amount: "₦350,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Uchechukwu Eze",
      farm: "Blue Sky Farm Cultivation",
      size: "18 Acres",
      task: "Furrowing the fields",
      amount: "₦450,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Emeka Ibe",
      farm: "Whispering Pines Farm Cultivation",
      size: "25 Acres",
      task: "Turning over the earth",
      amount: "₦400,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Ngozi Chukwu",
      farm: "Golden Fields Farm Cultivation",
      size: "22 Acres",
      task: "Soil aeration",
      amount: "₦500,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Chijioke Nwankwo",
      farm: "Sunnyvale Acres Cultivation",
      size: "20 Acres",
      task: "Cultivating the land",
      amount: "₦300,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Chinonso Ugochukwu",
      farm: "Maple Leaf Farm Cultivation",
      size: "28 Acres",
      task: "Ground tilling",
      amount: "₦700,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Adaobi Okafor",
      farm: "Green Pastures Farm Cultivation",
      size: "10 Acres",
      task: "Preparing the field",
      amount: "₦250,000",
      date: "Mon. Sep 16, 2024",
    },
    {
      name: "Kelechi Nwafor",
      farm: "Harvest Moon Farm Cultivation",
      size: "12 Acres",
      task: "Ploughing",
      amount: "₦200,000",
      date: "Mon. Sep 16, 2024",
    },
  ];
  
  export default function EarningsTable() {
    return (
      <div className="er-table-wrap">
        <div className="er-table-head">
          <div className="er-table-title">
            Recent Trasactions <span className="er-info">ⓘ</span>
          </div>
          <button className="er-seeall">See all Transactions</button>
        </div>
  
        <div className="er-table-scroll">
          <table className="er-table">
            <thead>
              <tr>
                <th>Farmer’s Name</th>
                <th>Farm Name</th>
                <th>Farm Size</th>
                <th>Task</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
  
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td className="er-namecell">
                    <span className="er-avatar">{r.name[0]}</span>
                    <span>{r.name}</span>
                  </td>
                  <td>{r.farm}</td>
                  <td>{r.size}</td>
                  <td>{r.task}</td>
                  <td className="er-amt">{r.amount}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  