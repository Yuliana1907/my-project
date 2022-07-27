import {Button, Form, Input, Modal} from 'antd'
import React, { createRef, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { requestEditUserInfo, requestUserInfo } from 'src/redux/users/actions'
import { getUserInfo } from 'src/redux/users/selectors'
import './EditProfileTab.scss'
import ReactCrop from 'react-image-crop'
import noFoto from 'src/public/noFoto.png'
import 'react-image-crop/lib/ReactCrop.scss'
import { useNavigate } from 'react-router-dom'
import { UserData } from 'src/constants/Api/User/User.d'

export const EditProfileTab = () => {
  const [form] = Form.useForm()
  const ref = createRef<HTMLInputElement>()

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { user } = useAppSelector(getUserInfo)

  useEffect(() => {
    dispatch(requestUserInfo())
  }, [])

  useEffect(() => {
    form.setFieldsValue(user)
    setCropImage(user?.logo ? user?.logo : noFoto)
  }, [user])

  const [visible, setVisible] = useState(false)
  const [src, setSelectedImage] = useState<string>()
  const [image, setImage] = useState<any>()
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [blob, setBlob] = useState<any>()
  const [removeImage, setRemoveImage] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [crop, setCrop] = useState<any>({ unit: '%', x: 25, y: 25, width: 40, height: 40, aspect: 1 / 1 })
  const [fileName, setFileName] = useState<string>()

  const getCroppedImage = async () => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d')
  
    ctx?.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    )

    setVisible(false)

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob: any) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'))
                    return;
                }

                blob.name = fileName
                const croppedImageUrl = window.URL.createObjectURL(blob)
                setBlob(blob)
                setCropImage(croppedImageUrl)
                resolve(croppedImageUrl)
            }, 'image/jpeg'
        )
    })

  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleFileChange = (event: any) => {
      if (event.target.files && event.target.files.length > 0){
        setSelectedImage(URL.createObjectURL(event.target.files[0]))
        setFileName(event.target.files[0].name)
        setVisible(true)
        setRemoveImage(false)
    }
  }

   const onFinish = (values: UserData) => { 
    if(values){
        if(!blob && removeImage){
            dispatch(requestEditUserInfo({user: {...values, logo : null }}))
        } else if(blob?.name){
            const formData = new FormData()
            formData.append('logo', blob, blob?.name)
            dispatch(requestEditUserInfo({user: {...values, logo : formData.get('logo') }}))
        }
        dispatch(requestEditUserInfo({user: values}))
    }

    navigate('/main')
   }

   const handleEditCancel = () => {
    navigate('/main')
   }

   const handleRemoveImage = () => {
    setRemoveImage(true)
    setCropImage(noFoto)
    setIsDisabled(false)
   }

   const onFieldsChange = () => {
    setIsDisabled(!form.isFieldsTouched(true))
   }

   const handleMouseOut = () => {
    if (document.activeElement === ref.current) {
      setIsDisabled(false)
    }
  };

  return (
    <div className='edit-profile'>
        <div className='edit-profile_title'>Edit profile</div>
        <Form form={form} onFinish={onFinish} onFieldsChange={onFieldsChange}>
        <div className='upload-info'>
                {
                    cropImage && <img className='upload-image' alt='upload' src={cropImage} />        
                }
                <div>
                    <div className='edit-profile_username'>{user?.username}</div>
                    <div className='edit-profile_choose-image'>
                        <label htmlFor='upload-photo' onMouseOut={handleMouseOut} className='upload-file'>Upload file</label>
                        <input 
                            type="file" 
                            className='file-input' 
                            id='upload-photo'
                            ref={ref} 
                            onChange={handleFileChange} 
                        />  
                        {((!!user?.logo && !removeImage) || (cropImage && image)) && (
                            <div className="remove-image" onClick={handleRemoveImage}>
                                Remove
                            </div>
                        )} 
                    </div>
                </div>
            </div>  
            <div className='name-info'>
                <Form.Item name="username">
                    <Input className='name-input' placeholder="Username" />
                </Form.Item>
                <Form.Item name="name">
                    <Input className='name-input' placeholder="Full name" />
                </Form.Item>
            </div>
            <Form.Item name="email">
                <Input className='email-input' placeholder="Email" disabled />
            </Form.Item>
            <Form.Item name="about">
                <Input.TextArea rows={5} className='about-input' placeholder="About your profile" />
            </Form.Item>
            <div className='edit-profile_button'>
                <Form.Item>
                    <Button className='cancel' onClick={handleEditCancel}>Cancel</Button>
                </Form.Item>
                <Form.Item>
                    <Button className='save' disabled={isDisabled} type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </div>
        </Form>
        {
            src && (
                <Modal visible={visible} onOk={getCroppedImage} onCancel={handleCancel}>
                    <div className='modal-info'>Upload profile photo</div>
                    <ReactCrop circularCrop src={src} onImageLoaded={setImage} crop={crop} onChange={setCrop}  />
                </Modal>
            )
        }
    </div>
  )
}

