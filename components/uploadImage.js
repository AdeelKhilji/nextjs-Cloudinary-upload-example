import { useState } from 'react';

export default function UploadImage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function(onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
    
    const formData = new FormData();

    for( const file of fileInput.files)
    {
      formData.append('file',file);
    }

    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}`)

    const data = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,{
      method: 'POST',
      body: formData
    }).then(response => response.json());

    console.log('data',data);
  }

  return (
    <div>
        <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          
          <input type="file" name="file" /><br/><br/>
          
          <img src={imageSrc} /><br/><br/>
          
          {imageSrc && !uploadData && (
            
          <button>Upload Files</button>
          )}

          {uploadData && (
            <code><pre>{JSON.stringify(uploadData, null, 2)}</pre></code>
          )}
        </form>
    </div>
  )
}
