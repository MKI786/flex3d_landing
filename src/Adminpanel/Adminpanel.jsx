import React, { useEffect, useState } from 'react'
import Adminpanelcss from '../Adminpanel/Adminpanelcss.module.css'
import { CiMenuKebab } from "react-icons/ci";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";


function Adminpanel() {

  const Host_url = import.meta.env.VITE_HOST_URL;


  const [dropindex, setdropindex] = useState(null);
  const [modelindex, setmodelindex] = useState(null);
  const [formpopupindex, setformpopupindex] = useState(null);
  const [modelformpopupindex, setmodelformpopupindex] = useState(null);



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



  const deletecustomizer = async (cid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Customizer?");
    if (!confirmDelete) {
      return;
    }
    const res = await fetch(`${Host_url}/client/deletecustomizer`, {
      method: 'POST',
      body: JSON.stringify({ cid }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      setstatusmessage(true);
      setTimeout(() => {
        setstatusmessage(false);
      }, 5000);
      fetchorders();
    }
    else {
    }
  }


  {/*---------------------------------********************------------------------------------------------------- */ }
  {/*---------------------------------MODEL-FORM-HANDLING-------------------------------------------------------- */ }
  {/*---------------------------------*********************------------------------------------------------------ */ }

  const [modelmessage, setmodelmessage] = useState(false);
  const [modelformdata, setmodelformdata] = useState({
    modelName: '',
    modelUrl: null,
    modelThumbnailurl: null,
    modelTextureurl: [],
  });

  const handlemodelformchange = (e) => {

    const { name, type, files, value, multiple } = e.target;
    if (type === "file") {
      if (multiple) {
        const selectedFiles = Array.from(files);
        console.log("Selected multiple files:", selectedFiles);
        setmodelformdata((prev) => ({
          ...prev,
          [name]: selectedFiles, // For textures (multiple images)
        }));
      } else {
        setmodelformdata((prev) => ({
          ...prev,
          [name]: files[0], // For modelUrl & thumbnail (single file)
        }));
      }
    } else {
      setmodelformdata((prev) => ({
        ...prev,
        [name]: value, // For text input (modelName)
      }));
    }
  }

  const handlemodelformsubmit = async (e, curl) => {
    e.preventDefault();


    console.log(modelformdata, curl);


    try {
      const modelData = new FormData();
      modelData.append("file", modelformdata.modelUrl);

      const res = await fetch(`${Host_url}/uploadglbfile`, {
        method: 'POST',
        body: modelData
      });

      const { link } = await res.json();
      console.log("uploaded glb file link ", link);



      // 2. Upload thumbnail
      const thumbData = new FormData();
      thumbData.append("file", modelformdata.modelThumbnailurl);
      thumbData.append("upload_preset", "flex3d");
      thumbData.append("cloud_name", "doofeeyue");

      const thumbRes = await fetch("https://api.cloudinary.com/v1_1/doofeeyue/image/upload", {
        method: "POST",
        body: thumbData,
      });
      const thumbUpload = await thumbRes.json();

      // 3. Upload each texture
      const textureUrls = [];

      for (let i = 0; i < modelformdata.modelTextureurl.length; i++) {
        const tex = modelformdata.modelTextureurl[i];

        // Skip if file is missing or not a File
        if (!tex || !(tex instanceof File)) {
          console.warn("Skipping invalid texture at index", i, tex);
          continue;
        }

        const texData = new FormData();
        texData.append("file", tex);
        texData.append("upload_preset", "flex3d");
        texData.append("cloud_name", "doofeeyue");

        try {
          const texRes = await fetch("https://api.cloudinary.com/v1_1/doofeeyue/image/upload", {
            method: "POST",
            body: texData,
          });

          const texUpload = await texRes.json();

          if (texUpload.secure_url) {
            textureUrls.push(texUpload.secure_url);
          } else {
            console.error("Upload failed for texture:", tex.name, texUpload);
          }
        } catch (err) {
          console.error("Error uploading texture:", tex.name, err);
        }
      }



      // 4. Send final data to backend (MongoDB)
      const finalBody = {
        modelName: modelformdata.modelName,
        modelUrl: link,
        modelThumbnailurl: thumbUpload.secure_url,
        modelTextureurl: textureUrls,
      };

      const backendRes = await fetch(`${Host_url}/client/assignmodel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelName: finalBody.modelName,
          modelUrl: finalBody.modelUrl,
          modelThumbnailurl: finalBody.modelThumbnailurl,
          modelTextureurl: finalBody.modelTextureurl,
          curl
        })

      });

      const result = await backendRes.json();
      if (backendRes.ok) {
        console.log("✅ MongoDB Upload Done:", result);
        setmodelmessage(true);
        setstatusmessage(true);
        setTimeout(() => {
          setstatusmessage(false);
          setmodelmessage(false);
        }, 8000);
        fetchorders();
      }






    } catch (err) {
      console.error("❌ Error uploading:", err);
    }
    e.target.reset();
  }




  const deletemodel = async (mid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this model?");
    if (!confirmDelete) {
      return;
    }
    const res = await fetch(`${Host_url}/client/deletemodel`, {
      method: 'POST',
      body: JSON.stringify({ mid }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      setstatusmessage(true);
      setTimeout(() => {
        setstatusmessage(false);
      }, 5000);
      fetchorders();
    }
    else {

    }
  }

  {/*---------------------------------MODEL-FORM-HANDLING-------------------------------------------------------- */ }



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

                  <div className={Adminpanelcss.client} key={i}>
                    <div className={Adminpanelcss.cud} >
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

                      <div className={Adminpanelcss.drop} onClick={() => (setmodelindex(modelindex === i ? null : i))}>
                        {modelindex === i ? <IoIosArrowDropupCircle style={{ background: 'transparent' }} /> :
                          <IoIosArrowDropdownCircle style={{ background: 'transparent' }} />}
                      </div>

                      <div className={Adminpanelcss.action} onClick={() => setmodelformpopupindex(modelformpopupindex === index ? null : index)}>
                        <CiMenuKebab style={{ background: 'transparent', color: 'black' }} />
                      </div>
                    </div>

                    {
                      (modelindex === i && c.Model && c.Model.length > 0) &&
                      c.Model.map((mod, ind) => {
                        return (
                          <div className={Adminpanelcss.mud} key={ind}>
                            <div className={Adminpanelcss.url}>
                              <img src={mod.modelThumbnailurl} width={100} alt="" loading='lazy' />
                            </div>
                            <button onClick={() => deletemodel(mod._id)} style={{ backgroundColor: 'rgb(148, 13, 13)', padding: '0.5rem', fontSize: '15px', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '10px 10px', boxShadow: '0px 0px 2px black' }}>Delete</button>
                          </div>
                        )
                      })
                    }


                    {modelformpopupindex === index && <div className={Adminpanelcss.formoverley}>
                      <form action="" method='POST' onSubmit={(e) => { handlemodelformsubmit(e, c.CURL) }}>

                        {modelmessage && <div className={Adminpanelcss.message}>
                          Model Assigned Successfuly !
                        </div>}

                        <label htmlFor="">Name:</label>
                        <input type="text" placeholder='Model Name' name='modelName' onChange={handlemodelformchange} required />

                        <label htmlFor="">{`Model (gltf / glb) < 10mb`} :</label>
                        <input type="file" placeholder='URL customizer' name='modelUrl' onChange={handlemodelformchange} required />

                        <label htmlFor="">Thumbnail:</label>
                        <input type="file" placeholder='URL customizer' name='modelThumbnailurl' onChange={handlemodelformchange} required />

                        <label htmlFor="textures">Textures:</label>
                        <input
                          type="file"
                          name="modelTextureurl"
                          multiple
                          accept="image/*"
                          required
                          onChange={handlemodelformchange}
                        />
                        <button type='submit'>Assign</button>

                        <div className={Adminpanelcss.cross} onClick={() => setmodelformpopupindex(null)}>
                          <IoMdCloseCircle style={{ fontSize: '50px', color: "rgb(24, 109, 121)" }} />
                        </div>
                      </form>

                      <button type='button' id={Adminpanelcss.deleteclient} onClick={() => deletecustomizer(c._id)} > Delete Customizer </button>
                    </div>}

                  </div>
                ))}

















              {/*--------------------------------------CUSTOMIZER-ASSIGNING-------------------------------------------------------------*/}
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
              {/*---------------------------------CUSTOMIZER-ASSIGNING-------------------------------------------------------------*/}


              {/*---------------------------------MODEL-ASSIGNING-------------------------------------------------------------*/}

              {/*-------------------------------MODEL-ASSIGNING-------------------------------------------------------------*/}




            </div>

          ))
        }


        {statusmessage && <div className={Adminpanelcss.statusmessage}>
          Action has been Applied Successfuly !
        </div>}






      </div>

    </>
  )
}

export default Adminpanel;