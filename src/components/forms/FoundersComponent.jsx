import React from 'react';
import dan from "../../assets/dan.png";
import mar from "../../assets/mar.png";
import tri from "../../assets/tri.png";

const FoundersComponent = () => {
  const founders = [
    {
      name: "Daniel Agbojo",
      title: "CEO/Co-founder",
      description: "Data analytics specialist, AI & Sustainable Agriculture expertise, Sales and Marketing",
      image: dan
    },
    {
      name: "Marvin Daniels",
      title: "CSO/Co-founder",
      description: "6+ years in West African agribusiness, Sustainable food systems expert, Business Development",
      image: mar
    },
    {
      name: "Triumphant Akinola",
      title: "CTO/ Co-Founder",
      description: "5 years + experience Software Engineer, AI Solutions Engineer, Innovating AI Solutions, GENAI Leader",
      image: tri
    }
  ];console.log(founders.image)

  return (
    <div className="founders-container">
      <style jsx>{`
        .founders-container {
          padding: 60px 20px;
          background: linear-gradient(135deg, #f0f8ff 0%, #e8f5e8 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .founders-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #2d5d31;
          text-align: center;
          margin-bottom: 80px;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .founders-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
          max-width: 1200px;
          width: 100%;
        }

        .founder-card {
          background: white;
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .founder-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .founder-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4CAF50, #2E7D32);
        }

        .founder-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
          font-weight: bold;
          box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
          position: relative;
          overflow: hidden;
        }

        .founder-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }
        .founder-image img{
          width: 100%;
        }

        .founder-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d5d31;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .founder-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #4CAF50;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .founder-description {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .founders-container {
            padding: 40px 15px;
          }

          .founders-title {
            font-size: 2.5rem;
            margin-bottom: 50px;
            letter-spacing: 1px;
          }

          .founders-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 400px;
          }

          .founder-card {
            padding: 30px 20px;
          }

          .founder-image {
            width: 120px;
            height: 120px;
            font-size: 2.5rem;
            margin-bottom: 25px;
          }

          .founder-name {
            font-size: 1.5rem;
          }

          .founder-title {
            font-size: 1rem;
          }

          .founder-description {
            font-size: 0.9rem;
          }
        }

        /* Tablet Responsive */
        @media (max-width: 1024px) and (min-width: 769px) {
          .founders-container {
            padding: 50px 20px;
          }

          .founders-title {
            font-size: 3rem;
            margin-bottom: 60px;
          }

          .founders-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 50px;
            max-width: 800px;
          }

          .founder-card {
            padding: 35px 25px;
          }

          .founder-image {
            width: 130px;
            height: 130px;
            font-size: 2.8rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .founders-container {
            padding: 30px 10px;
          }

          .founders-title {
            font-size: 2rem;
            margin-bottom: 40px;
          }

          .founders-grid {
            gap: 30px;
            max-width: 100%;
          }

          .founder-card {
            padding: 25px 15px;
            border-radius: 15px;
          }

          .founder-image {
            width: 100px;
            height: 100px;
            font-size: 2rem;
            margin-bottom: 20px;
          }

          .founder-name {
            font-size: 1.3rem;
          }

          .founder-title {
            font-size: 0.9rem;
          }

          .founder-description {
            font-size: 0.85rem;
            line-height: 1.5;
          }
        }
      `}</style>

      <h1 className="founders-title">MEET OUR FOUNDERS</h1>
      
      <div className="founders-grid">
        {founders.map((founder, index) => (
          <div key={index} className="founder-card">
            <div className="founder-image">      
                {founder.image ? (
                    <img src={founder.image} alt={founder.name} />
                ) : (
                    <div className="founder-image-placeholder">
                    {founder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                )}       
            </div>
            <h2 className="founder-name">{founder.name}</h2>
            <h3 className="founder-title">{founder.title}</h3>
            <p className="founder-description">{founder.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundersComponent;
