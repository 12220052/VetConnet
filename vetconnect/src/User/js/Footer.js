import React from 'react';
import logo from '../Images/logo.png'; // Ensure the correct path to your logo
import footer from '../Images/footer.png'; // Use the uploaded image as background

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: `url(${footer})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '623px',
        color: 'white',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
      }}
    >
       <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'left',
          maxWidth: '1200px',
          marginLeft: '50px',
          marginRight: '50px',
          marginTop: '200px',
        }}
      >
        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <img
            src={logo}
            alt="VetConnect Logo"
            style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px' }}
          />
          <p style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            VetConnect - Where Care Meets Convenience.<br />
            Connecting pet owners & livestock farmers with trusted veterinarians across the countries.
          </p>
          <p style={{ fontSize: '14px', margin: '5px 0' }}>VetConnect@gmail.com</p>
          <p style={{ fontSize: '14px', margin: '5px 0' }}>Bhutan</p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            width: '100%',
            gap: '120px',
            // maxWidth: '1000px',
            marginLeft: '200px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Register as</h3>
            <p style={{borderBottom:'2px solid white' }}></p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2',marginLeft:'15px', marginTop:'10px' }}>
              <li>Pet Parents</li>
              <li>Vets</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>About VetConnect</h3>
            <p style={{borderBottom:'2px solid white' }}></p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2',marginLeft:'15px', marginTop:'10px'  }}>
              <li>About Us</li>
              <li>Diseases Outbreak</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Reviews</h3>
            <p style={{borderBottom:'2px solid white' }}></p>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2',marginLeft:'15px', marginTop:'10px'  }}>
              <li>Reviews</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: '50px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '15px',
          textAlign: 'center',
        }}
      >
        <p>Copyright © 2025 Vet Connect. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
