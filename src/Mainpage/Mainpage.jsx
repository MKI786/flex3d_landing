import React, { useEffect, useRef, useState } from 'react'
import { FaEye } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaS, FaSignal } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { TbHexagonNumber1Filled } from "react-icons/tb";
import { TbHexagonNumber3Filled } from "react-icons/tb";
import { TbHexagonNumber2Filled } from "react-icons/tb";
import { TbHexagonNumber4Filled } from "react-icons/tb";
import { TbHexagonNumber5Filled } from "react-icons/tb";
import { IoMdCloseCircle } from "react-icons/io";
import { FaSquareWhatsapp } from "react-icons/fa6";
import imageCompression from 'browser-image-compression';


import Mainpagecss from '../Mainpage/Mainpagecss.module.css'
function Mainpage() {


  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);
  const [formpopup, setformpopup] = useState(false);
  const [message, setmessage] = useState(false);

  const [form, setform] = useState({});

  const handleonchange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })
  }


  const frontimageref = useRef(null);
  const backimageref = useRef(null);
  const topimageref = useRef(null);
  const bottomimageref = useRef(null);

  const [frontimage, setfrontimage] = useState(null);
  const [backimage, setbackimage] = useState(null);
  const [topimage, settopimage] = useState(null);
  const [bottomimage, setbottomimage] = useState(null);

  const [frontpreview, setfrontpreview] = useState(null);
  const [backpreview, setbackpreview] = useState(null);
  const [toppreview, settoppreview] = useState(null);
  const [bottompreview, setbottompreview] = useState(null);




  const handlefrontimage = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file) {
      setfrontimage(file);
      console.log(" front uploaded successfuly", file)
      setfrontpreview(URL.createObjectURL(file));

      if (frontimageref.current) {
        frontimageref.current.value = "";
      }
    }
  }


  const handlebackimage = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file) {
      setbackimage(file);

      setbackpreview(URL.createObjectURL(file));
      console.log(" back uploaded successfuly", file)

      if (backimageref.current) {
        backimageref.current.value = "";
      }
    }


  }
  const handletopimage = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file) {
      settopimage(file);
      settoppreview(URL.createObjectURL(file));
      console.log(" top uploaded successfuly", file)

      if (topimageref.current) {
        topimageref.current.value = "";
      }
    }
  }
  const handlebottomimage = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file) {
      setbottomimage(file);
      setbottompreview(URL.createObjectURL(file));
      console.log(" bottom uploaded successfuly", file)

      if (bottomimageref.current) {
        bottomimageref.current.value = "";
      }
    }
  }


  const [showPopup, setshowPopup] = useState(false);
  const [uploadsCompleted, setUploadsCompleted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const Host_url = import.meta.env.VITE_HOST_URL;


  const handlesubmit = async (e) => {
    e.preventDefault();

    setshowPopup(true);


    const compressImage = async (imageFile) => {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      return await imageCompression(imageFile, options);
    };


    const uploadImage = async (imageFile) => {

      const compressedFile = await compressImage(imageFile);
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append("upload_preset", "flex3d");
      formData.append("cloud_name", "doofeeyue");
    
      const response = await fetch('https://api.cloudinary.com/v1_1/doofeeyue/image/upload', {
        method: 'POST',
        body: formData
      });
    
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
      return null;
    };
    
    const [frontURL, backURL, topURL, bottomURL] = await Promise.all([
      frontimage ? uploadImage(frontimage) : null,
      backimage ? uploadImage(backimage) : null,
      topimage ? uploadImage(topimage) : null,
      bottomimage ? uploadImage(bottomimage) : null
    ]);
    
  
    const resp = await fetch(`${Host_url}/client/ordersubmit`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" }
    })

    if (resp.ok) {
      const data = await resp.json();
      console.log("form uploaded to db successfully ", data);
      setmessage(true);
      setTimeout(() => {
        setmessage(false);
      }, 5000);
    }
    else {
      console.log("ther is error in uploading");
    }


    const phoneNumber = "923335456419";
    const message = `🪑 *New Custom Order Received!*

👤 Name: ${form.name}
📞 Whatsapp: ${form.whatsapp}
   product price: ${form.price}
🖼️ Images:
- Front: ${frontURL || "Not provided"}
- Back: ${backURL || "Not provided"}
- Top: ${topURL || "Not provided"}
- Bottom: ${bottomURL || "Not provided"}

📩 Sent via flex3d`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    setWhatsappUrl(whatsappURL);
    setUploadsCompleted(true);

    e.target.reset();
  }





  return (
    <>


      <div className={Mainpagecss.r1}>

        <div className={Mainpagecss.r1c1}>

          <div >
            <div className={Mainpagecss.heading1}>
              Customize 3D Products For Your E-commerce store in Real-Time
            </div>
            <br />
            <div className={Mainpagecss.heading2}>
              Design and Visualize your product instantly with our live 3D Customizer.
            </div>
          </div>


          <div className={Mainpagecss.ctabutton}>
            <button type='button' onClick={() => (setformpopup(true))} >Order Now !</button>
          </div>

        </div>

        <div className={Mainpagecss.r1c2}>
          <img id={Mainpagecss.i1} src="p1.png" alt="" />
        </div>



      </div>

      <div className={Mainpagecss.video}>

        <div id={Mainpagecss.vidc}>

          <p id={Mainpagecss.gt}>Free Trial 1 Month</p>

          <video src="/flex3d_vid_optimized.mp4" id={Mainpagecss.vid} loop autoPlay muted preload='auto' playsInline></video>
        </div>


        <div className={Mainpagecss.ins}>
          <ul>
            <li>
              <TbHexagonNumber1Filled style={{ color: 'rgb(28, 122, 134)', fontSize: '40px', backgroundColor: 'transparent' }} />Click "Order Now" to send your product images {`(front / back).`}</li>

            <li id={Mainpagecss.urdui}>اپنی پروڈکٹ کی تصاویر (سامنے / پیچھے) بھیج کر "ابھی آرڈر " پر کلک کریں۔</li>
            <li> <TbHexagonNumber2Filled style={{ color: 'rgb(28, 122, 134)', fontSize: '40px', backgroundColor: 'transparent' }} />Get a Ready made 3D customizer for your product.</li>
            <li id={Mainpagecss.urdui}>اپنے پروڈکٹ کے لیے تیار شدہ 3D کسٹمائزر حاصل کریں۔</li>

            <li> <TbHexagonNumber3Filled style={{ color: 'rgb(28, 122, 134)', fontSize: '40px', backgroundColor: 'transparent' }} />Share that customizer with your customers / e-commerce website.</li>
            <li id={Mainpagecss.urdui}>اپنے کسٹمائزر کو اپنے صارفین / ای کامرس ویب سائٹ کے ساتھ شیئر کریں۔ </li>

            <li> <TbHexagonNumber4Filled style={{ color: 'rgb(28, 122, 134)', fontSize: '40px', backgroundColor: 'transparent' }} />Get Orders on your WhatsApp directly.</li>
            <li id={Mainpagecss.urdui}>اپنے واٹس ایپ پر براہ راست آرڈر حاصل کریں۔ </li>

            <li> <TbHexagonNumber5Filled style={{ color: 'rgb(28, 122, 134)', fontSize: '40px', backgroundColor: 'transparent' }} />Drive sales and generate more orders upto 40 - 50%.</li>
            <li id={Mainpagecss.urdui}>سیلز بڑھائیں اور 40 - 50% تک مزید آرڈر تیار کریں </li>

          </ul>

          <div className={Mainpagecss.ctabutton2}>
            <button type='button' onClick={() => (setformpopup(true))} >Order Now !</button>
          </div>

        </div>

      </div>

      <div className={Mainpagecss.r2}>

        <div className={Mainpagecss.box}>

          <div className={Mainpagecss.boxr1}>
            <FaEye style={{ fontSize: "80px", color: 'rgb(24, 109, 121)' }} />
          </div>

          <div className={Mainpagecss.boxr2}>
            Live Preview
          </div>

          <div className={Mainpagecss.boxr3}>
            See changes to your product in realtime as you customize
          </div>

        </div>


        <div className={Mainpagecss.box}>

          <div className={Mainpagecss.boxr1}>
            <IoLogoWhatsapp style={{ fontSize: "80px", color: 'rgb(24, 109, 121)' }} />
          </div>

          <div className={Mainpagecss.boxr2}>
            Order via WhatsApp
          </div>

          <div className={Mainpagecss.boxr3}>
            Send your custom design directly to us through whatsapp
          </div>

        </div>



        <div className={Mainpagecss.box}>

          <div className={Mainpagecss.boxr1}>
            <FaSignal style={{ fontSize: "80px", color: 'rgb(24, 109, 121)' }} />
          </div>

          <div className={Mainpagecss.boxr2}>
            Vendor Friendly
          </div>

          <div className={Mainpagecss.boxr3}>
            Easy-to-use tools designed to meet business needs.
          </div>

        </div>



        <div className={Mainpagecss.box}>

          <div className={Mainpagecss.boxr1}>
            <BsFillLightningChargeFill style={{ fontSize: "80px", color: 'rgb(24, 109, 121)' }} />
          </div>

          <div className={Mainpagecss.boxr2}>
            Fast and Easy
          </div>

          <div className={Mainpagecss.boxr3}>
            Simple interface for quick customization without hassle.
          </div>

        </div>


      </div>


      <div className={Mainpagecss.footer}>

        <div className={Mainpagecss.left}>
          <div style={{ backgroundColor: "transparent", cursor: 'pointer', fontWeight: 'lighter', fontFamily: 'sans-serif' }}>Email: muhammadkhalidijaz786@gmail.com</div>
        </div>

        <div className={Mainpagecss.right}>
          &copy; 2025 flex3d
        </div>

      </div>




      {formpopup && <div className={Mainpagecss.formoverley}>

        <form action="" method='POST' onSubmit={(e) => (handlesubmit(e))}>

          <label htmlFor="">Name:</label>
          <input type="text" placeholder='Your name' name='name' required onChange={(e) => (handleonchange(e))} />

          <label htmlFor="">Whatsapp Number:</label>
          <input type="text" inputMode='numeric' maxLength={11} pattern='\d*' placeholder='Your Whatsapp' name='whatsapp' required onChange={(e) => (handleonchange(e))} />
          <label htmlFor="">Front Image:</label>


          <div style={{ background: 'transparent', width: '60%', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="file" ref={frontimageref} onChange={(e) => (handlefrontimage(e))} style={{ width: '60%' }} />
            <img src={frontpreview} alt="" width={70} style={{ borderRadius: '8px 8px' }} />
          </div>

          <label htmlFor="">Back Image:</label>
          <div style={{ background: 'transparent', width: '60%', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="file" ref={backimageref} onChange={(e) => (handlebackimage(e))} style={{ width: '60%' }} />
            <img src={backpreview} alt="" width={70} style={{ borderRadius: '8px 8px' }} />
          </div>

          <label htmlFor="">Top Image:</label>
          <div style={{ background: 'transparent', width: '60%', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="file" ref={topimageref} onChange={(e) => (handletopimage(e))} style={{ width: '60%' }} />
            <img src={toppreview} alt="" width={70} style={{ borderRadius: '8px 8px' }} />
          </div>

          <label htmlFor="">Bottom Image:</label>
          <div style={{ background: 'transparent', width: '60%', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <input type="file" ref={bottomimageref} onChange={(e) => (handlebottomimage(e))} style={{ width: '60%' }} />
            <img src={bottompreview} alt="" width={70} style={{ borderRadius: '8px 8px' }} />
          </div>

          <label htmlFor="">Product Price:</label>
          <input type="number" placeholder='Product price' name='price' required onChange={(e) => (handleonchange(e))} />

          <br />

          {message && <div className={Mainpagecss.message}>
            Your Order Has been Submitted Successfuly !
          </div>}

          <button type='submit' id={Mainpagecss.orderbtn}>Place Order</button>

        </form>

        <div className={Mainpagecss.cross} onClick={() => (setformpopup(false))}>
          <IoMdCloseCircle style={{ fontSize: '50px', color: "rgb(24, 109, 121)" }} />
        </div>


      </div>}



      { showPopup && (
        <div className={Mainpagecss.overlay}>
          {uploadsCompleted ? (
            <div className={Mainpagecss.popup}>
              ✅ Order completed successfully! <br /><br />
              <button
                type='button'
                id={Mainpagecss.stw}
                onClick={() => {
                  if (whatsappUrl) {
                    window.open(whatsappUrl, "_blank");
                    setshowPopup(false);
                  }
                }}
              >
                Send to WhatsApp
              </button>
            </div>
          ) : (
            <div className={Mainpagecss.popup} id={Mainpagecss.wait}>
              🕐 Order is completing...<br />
              Please wait...
            </div>
          )}
        </div>
      )}


      <div className={Mainpagecss.whatsapp} >
      <a
    href="https://api.whatsapp.com/send?phone=923335456419&text=Hello%20I%20want%20to%20place%20an%20order"
    target="_blank"
    rel="noopener noreferrer"
    style={{textDecoration:'none', color:'inherit', display:'flex', alignItems:'center', justifyContent:'center'}}
  >
    <FaSquareWhatsapp />
  </a>
      </div>

    </>
  )
}

export default Mainpage