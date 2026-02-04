// import React from "react";

// const PieChart = () => {
//   const radius = 50; // Radius of the pie chart
//   const strokeWidth = 10; // Thickness of the arcs
//   const center = 60; // Center of the pie chart
//   const circumference = 2 * Math.PI * radius;

//   // Data for each section
//   const data = [
//     { label: "Completed", percentage: 35, color: "#2D9C3C" },
//     { label: "Cancelled", percentage: 25, color: "#F2C94C" },
//     { label: "Pending", percentage: 18, color: "#27AE60" },
//   ];

//   const totalPercentage = 78; // Total percentage covered by arcs
//   const blankPercentage = 100 - totalPercentage; // Remaining percentage (22%)
//   const totalDashArray = (totalPercentage / 100) * circumference;

//   // Calculate stroke offsets for each arc
//   let offset = 0;

//   return (
//     <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
//       <svg
//         width={140}
//         height={140}
//         style={{
//           transform: "rotate(-210deg)", // Rotate the entire pie chart
//           overflow: "visible", // Ensure nothing is clipped
//         }}
//       >
//         {/* Background circle */}
//         <circle
//           cx={center}
//           cy={center}
//           r={radius}
//           fill="none"
//           stroke="#f5f5f5"
//           strokeWidth={strokeWidth}
//         />

//         {/* Colorful arcs */}
//         {data.map((item, index) => {
//           // Scale percentage to fit 78% of the circle
//           const scaledPercentage = (item.percentage / totalPercentage) * totalPercentage;
//           const dashArray = (scaledPercentage / 100) * circumference;
//           const dashOffset = circumference - offset - dashArray;

//           // Update offset for the next arc
//           offset += dashArray;

//           // Calculate dot position at the end of each arc
//           const angle = ((offset - dashArray) / circumference) * 2 * Math.PI - Math.PI / 2;
//           const dotX = center + radius * Math.cos(angle);
//           const dotY = center + radius * Math.sin(angle);

//           return (
//             <g key={index}>
//               <circle
//                 cx={center}
//                 cy={center}
//                 r={radius}
//                 fill="none"
//                 stroke={item.color}
//                 strokeWidth={strokeWidth}
//                 strokeDasharray={`${dashArray} ${circumference - dashArray}`}
//                 strokeDashoffset={dashOffset}
//                 strokeLinecap="round"
//               />
//               {/* White dot at the end of the arc */}
//               <circle cx={dotX} cy={dotY} r={3} fill="#FFFFFF" />
//             </g>
//           );
//         })}
//       </svg>

//       {/* Centered Percentage */}
//       <div
//         style={{
//           position: "relative",
//           top: -134,
//           left: -9,
//           fontSize: 18,
//           fontWeight: "bold",
//           color: "#333",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100px",
//         }}
//       >
//         78%
//       </div>

//       {/* Legend */}
//       <div style={{ marginTop: -50 }}>
//         {data.map((item, index) => (
//           <div
//             key={index}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               marginBottom: 8,
//             }}
//           >
//             <span
//               style={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: "50%",
//                 backgroundColor: item.color,
//                 display: "inline-block",
//                 marginRight: 8,
//               }}
//             ></span>
//             {item.label}
//           </div>
//         ))}
//       </div>

//       {/* Button */}
//       <button
//         style={{
//           marginTop: 20,
//           padding: "8px 16px",
//           backgroundColor: "#E6F4EA",
//           color: "#27AE60",
//           border: "none",
//           borderRadius: 8,
//           cursor: "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         Download Statistics
//       </button>
//     </div>
//   );
// };

// export default PieChart;


import React from "react";

const PieChart = () => {
  const radius = 50; // Radius of the pie chart
  const strokeWidth = 12; // Thickness of the arcs
  const center = 75; // Center of the pie chart
  const circumference = 2 * Math.PI * radius;

  // Data for each section
  const data = [
    { label: "Completed", percentage: 45, color: "#2D9C3C" },
    { label: "Cancelled", percentage: 25, color: "#F2C94C" },
    { label: "Pending", percentage: 18, color: "#27AE60" },
  ];

  const totalPercentage = 78; // Total percentage covered by arcs
  const blankPercentage = 100 - totalPercentage; // Remaining percentage (22%)
  const totalDashArray = (totalPercentage / 100) * circumference;

  // Calculate stroke offsets for each arc
  let offset = 0;

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <svg
        width={150}
        height={150}
        style={{
          transform: "rotate(-250deg)", // Rotate the entire pie chart
          overflow: "visible", // Ensure nothing is clipped
          background: "blue"
        }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f5f5f5"
          strokeWidth={strokeWidth}
        />

        {/* Colorful arcs */}
        {data.map((item, index) => {
          // Scale percentage to fit 78% of the circle
          const scaledPercentage = (item.percentage / totalPercentage) * totalPercentage;
          const dashArray = (scaledPercentage / 100) * circumference;
          const dashOffset = circumference - offset - dashArray;

          // Calculate start and end angles
          const startAngle = (offset / circumference) * 2 * Math.PI - Math.PI / 2;
          const endAngle =
            ((offset + dashArray) / circumference) * 2 * Math.PI - Math.PI / 2;

          // Update offset for the next arc
          offset += dashArray;

          // Calculate start and end dot positions
          const startX = center + radius * Math.cos(startAngle);
          const startY = center + radius * Math.sin(startAngle);
          const endX = center + radius * Math.cos(endAngle);
          const endY = center + radius * Math.sin(endAngle);

          return (
            <g key={index}>
              {/* Colored arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
              {/* White dot at the start of the arc */}
              <circle cx={startX} cy={startY} r={3} fill="#FFFFFF" />
              {/* White dot at the end of the arc */}
              <circle cx={endX} cy={endY} r={3} fill="#FFFFFF" />
            </g>
          );
        })}
      </svg>

      {/* Centered Percentage */}
      <div
        style={{
          position: "relative",
          top: -134,
          left: -9,
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100px",
        }}
      >
        78%
      </div>

      {/* Legend */}
      <div style={{ marginTop: -50 }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
                display: "inline-block",
                marginRight: 8,
              }}
            ></span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        style={{
          marginTop: 20,
          padding: "8px 16px",
          backgroundColor: "#E6F4EA",
          color: "#27AE60",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Download Statistics
      </button>
    </div>
  );
};

export default PieChart;
