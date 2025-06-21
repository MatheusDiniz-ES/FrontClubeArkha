import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ClassNameValue } from 'tailwind-merge'

interface Props {
  saveFile?: (e: File | null) => void;//Dispatch<SetStateAction<File | null>>
  saveMultpleFile?: (e: File[] | null) => void;
  children: React.ReactNode
  preview?: (e: string) => void;
  typeFiles?: 1 | 2 | 3 | 4 | 5
  className?: ClassNameValue
  disabled?: boolean
  mutiple?: boolean
}

export const MyDropzoneFiles: React.FC<Props> = ({
  saveMultpleFile,
  saveFile,
  children,
  typeFiles = 1,
  preview,
  className,
  disabled = false,
  mutiple = false
}) => {

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = mutiple ? acceptedFiles : acceptedFiles[0]

      const uri = mutiple ? file.map((fileItem: any) => { return URL.createObjectURL(fileItem) }) : URL.createObjectURL(file)
      
      //const uri = URL.createObjectURL(file)
      if(preview){
        preview(uri)
      }

      if(saveMultpleFile){
        saveMultpleFile(file)
      }

      if(saveFile) {
        saveFile(file)
      }
    },
    [saveFile, saveMultpleFile, preview]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept:
      typeFiles === 1
        ? { 'application/pdf': ['.pdf'] }
        : typeFiles === 2
        ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.gfif'] }
        : typeFiles === 3
        ? { 'text/csv': ['.csv'] }
        : typeFiles === 4
        ? { 'application/xml': ['.xml'] } :
        typeFiles === 5 ? { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.gfif'], 'text/csv': ['.csv'],'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] } :
        { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.gfif'], 'text/csv': ['.csv'],'application/msword': ['.doc'],'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
  })

  return (
    <div {...getRootProps()} className={`w-full ${className || ''}`}>
      <input {...getInputProps()} name="enviarDoc" disabled={disabled}/>
        {children}
    </div>
  )
}