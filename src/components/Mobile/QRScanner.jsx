import React, { useState, useRef, useEffect } from 'react'
import { X, Loader } from 'lucide-react'
import './QRScanner.css'

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null)
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    startScanning()
    return () => stopScanning()
  }, [])

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsScanning(true)
      scanQRCode()
    } catch (err) {
      setError('Camera access denied. Please allow camera access to scan QR codes.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
    }
  }

  const scanQRCode = () => {
    // This is a simplified version - you would use a QR scanning library
    // like jsQR or zxing for production
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // For production, integrate with jsQR library
      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      // const code = jsQR(imageData.data, imageData.width, imageData.height)
      // if (code) {
      //   onScan(code.data)
      //   stopScanning()
      //   onClose()
      // }

      if (isScanning) {
        requestAnimationFrame(scanQRCode)
      }
    }
  }

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-container">
        <div className="qr-scanner-header">
          <h3>Scan QR Code</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error ? (
          <div className="qr-scanner-error">
            <p>{error}</p>
            <button className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="qr-scanner-content">
            <video ref={videoRef} autoPlay playsInline className="scanner-video" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="qr-scanner-guides">
              <div className="corner top-left" />
              <div className="corner top-right" />
              <div className="corner bottom-left" />
              <div className="corner bottom-right" />
              <div className="scanning-line" />
            </div>

            <div className="qr-scanner-text">
              <p>Position QR code in frame</p>
              <div className="scanner-loader">
                <Loader size={24} className="animate-spin" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRScanner
