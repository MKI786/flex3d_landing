import React, { useEffect, useState } from 'react'
import Adminpanelcss from '../Adminpanel/Adminpanelcss.module.css'
import { CiMenuKebab } from "react-icons/ci";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";


function Adminpanel() {

  const Host_url = import.meta.env.VITE_HOST_URL;

  console.log("Hosted url is ", Host_url)

  const [dropindex, setdropindex] = useState(null);
  const [formpopupindex, setformpopupindex] = useState(null);



  const [orders, setorders] = useState([]);
  const [message, setmessage] = useState(false);
  const [delmessage, setdelmessage] = useState(false);
  const [statusmessage, setstatusmessage] = useState(false);



  const fetchorders = async () => {
    const res = await fetch(`${Host_url}/client/fetchorders`, {
      method: 'GET'
    })

    if (res.ok) {
      const data = await res.json();
      setorders(data);
    }
    else {
      const data = await res.json();
      console.log(data.error);
    }
  }

  useEffect(() => {
    fetchorders();
  }, [])




  const [cform, setcform] = useState({});

  const handleonchange = (e) => {
    setcform({
      ...cform,
      [e.target.name]: e.target.value
    })
  }


  const handlecformsubmit = async (e, cwhatsapp) => {
    e.preventDefault();

    const res = await fetch(`${Host_url}/client/assigncustomizer`, {
      method: 'POST',
      body: JSON.stringify({ ...cform, cwhatsapp }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      const data = await res.json();
      setmessage(true);
      setTimeout(() => {
        setmessage(false);
      }, 5000);
      fetchorders();

      const whatsappMessage = `🌟 New Customizer Assigned!\n\n📦 URL: ${cform.url}\n📄 Subscription: ${cform.status} Free for 1 Month \n\nCheck it now!`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappURL = `https://wa.me/${cwhatsapp}?text=${encodedMessage}`;
      window.open(whatsappURL, "_blank");

    }
    else {
      const data = await res.json();
      console.log(data.message);
    }

    e.target.reset();
  }


  const handledeleteclient = async (delwhatsapp) => {

    const res = await fetch(`${Host_url}/client/deleteclient`, {
      method: 'POST',
      body: JSON.stringify({ delwhatsapp }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      setdelmessage(true);

      await new Promise((resolve) => {
        setTimeout(() => {
          setdelmessage(false)
          fetchorders();
          resolve;
        }, 2000);
      })

    }
    else {
      const data = await res.json();
      console.log(data);
    }

  }




  const handlestatusaction = async (statusvalue, cwhatsapp, cid) => {

    const confirmAction = window.confirm("Do you want to proceed this action?");

    if (confirmAction) {
      const res = await fetch(`${Host_url}/client/handlestatusaction`, {
        method: 'POST',
        body: JSON.stringify({ statusvalue, cid }),
        headers: { "Content-Type": "application/json" }
      })

      if (res.ok) {

        const data = await res.json();

        console.log(data);

        setstatusmessage(true);
        setTimeout(() => {
          setstatusmessage(false);
        }, 5000);
        fetchorders();

        const whatsappMessage = `🌟 Subscription Action!\n\n📦 URL: ${data.message === "deleted" ? ' Removed ' : data.CURL}\n📄 Subscription: Current Status is - ${data.message === "deleted" ? "Deleted" : data.subscription} -  \n\nCheck it now!`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${cwhatsapp}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");

      }
      else {
        const data = await res.json();
        console.log(data);
      }
    }
  }


  return (
    <>

      <div className={Adminpanelcss.main}>
        <h3 id={Adminpanelcss.heading}>Flex3d admin panel</h3>


        {
          orders.map((value, index) => (

            <div className={Adminpanelcss.client} key={index}>

              <div className={Adminpanelcss.cld}>
                <div className={Adminpanelcss.name}>
                  <b style={{ background: 'transparent' }}>Name</b>: {value.name}
                </div>
                <div className={Adminpanelcss.whatsapp}>
                  <b style={{ background: 'transparent' }}>whatsapp</b>: {value.whatsapp}
                </div>

                <div className={Adminpanelcss.drop} onClick={() => (setdropindex(dropindex === index ? null : index))}>
                  {dropindex === index ? <IoIosArrowDropupCircle style={{ background: 'transparent' }} /> :
                    <IoIosArrowDropdownCircle style={{ background: 'transparent' }} />}
                </div>

                <div className={Adminpanelcss.action} onClick={() => setformpopupindex(formpopupindex === index ? null : index)}>
                  <CiMenuKebab style={{ background: 'transparent' }} />
                </div>

              </div>

              {(dropindex === index && value.customizer && value.customizer.length > 0) &&
                value.customizer.map((c, i) => (
                  <div className={Adminpanelcss.cud} key={i}>
                    <div className={Adminpanelcss.url}>
                      <b style={{ background: 'transparent' }}>URL :</b>{c.CURL}
                    </div>
                    <div className={Adminpanelcss.status}>
                      <b style={{ background: 'transparent' }}>Subscription</b>: <span style={{ textShadow: c.subscription === "Active" ? "0px 0px 1px green" : c.subscription === "Inactive" ? "0px 0px 1px red" : ' ', color: c.subscription === "Active" ? "green" : c.subscription === "Inactive" ? "red" : "blue", fontWeight: 'bold', fontFamily: 'sans-serif', background: 'transparent' }} > {c.subscription}</span>
                    </div>
                    <select name="" defaultValue={c.subscription} id={Adminpanelcss.select} onChange={(e) => { handlestatusaction(e.target.value, value.whatsapp, c._id) }}>
                      <option value="Trial">Trial</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Deleted">Delete</option>
                    </select>
                  </div>
                ))
              }

              {formpopupindex === index && <div className={Adminpanelcss.formoverley}>
                <form action="" method='POST' onSubmit={(e) => (handlecformsubmit(e, value.whatsapp))}>

                  {message && <div className={Adminpanelcss.message}>
                    Customizer Assigned Successfuly !
                  </div>}

                  {delmessage && <div className={Adminpanelcss.delmessage}>
                    Client Deleted Successfuly !
                  </div>}

                  <label htmlFor="">URL:</label>
                  <input type="text" placeholder='URL customizer' name='url' required onChange={handleonchange} />

                  <label htmlFor="">Status:</label>
                  <select name='status' id={Adminpanelcss.select} onChange={handleonchange} >
                    <option value="">select</option>
                    <option value="Trial">Trial</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <br />
                  <button type='submit'>Assign</button>

                  <div className={Adminpanelcss.cross} onClick={() => setformpopupindex(null)}>
                    <IoMdCloseCircle style={{ fontSize: '50px', color: "rgb(24, 109, 121)" }} />
                  </div>

                </form>

                <button type='button' id={Adminpanelcss.deleteclient} onClick={() => { handledeleteclient(value.whatsapp) }}> Delete Client </button>
              </div>}
            </div>

          ))}


        {statusmessage && <div className={Adminpanelcss.statusmessage}>
          Action has been Applied Successfuly !
        </div>}






      </div>

    </>
  )
}

export default Adminpanel