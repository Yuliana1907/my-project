import './Input.scss'
import cn from 'classnames'
import { InputType } from './Input.d'
import { Input as DefaultInput } from 'antd'

export const Input = ({className, onChange, value, disabled, label, type}: InputType) => {

  return (
        <div className='input-wrapper'>
            <DefaultInput autoComplete='new-password' id='label' onChange={onChange} type={type} placeholder=" " value={value} className={cn('default-input', className)}  disabled={disabled} />
            <div className="pocket"></div>
            <label htmlFor='label' className="label">{label}</label>
        </div>
    )
}