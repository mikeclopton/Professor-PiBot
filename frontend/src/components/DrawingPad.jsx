import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

const DrawingPad = ({ setResponse, setLatexPreview, onInputChange }) => {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        setCtx(context);
    }, []);

    const startDrawing = (e) => {
        setDrawing(true);
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!drawing) return;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setDrawing(false);
        ctx.closePath();
    };

    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onInputChange('');
        setPreview(null);
    };

    const previewDrawing = async () => {
        const image = canvasRef.current.toDataURL('image/png');
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/process-drawing', {
                src: image,
                formats: ['latex_styled'],
                data_options: { include_asciimath: true }
            });

            const latexOutput = response.data.latex_styled;
            console.log('DrawingPad latex output:', latexOutput);
            
            onInputChange(latexOutput);
            setLatexPreview(latexOutput);
            setPreview(latexOutput);
        } catch (error) {
            console.error('Error processing drawing:', error);
            setResponse('Error processing your drawing');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                style={{ border: '1px solid #000000' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button type="button" onClick={clearCanvas}>Clear Drawing</button>
                <button type="button" onClick={previewDrawing}>Preview</button>
                {preview && (
                    <div style={{ 
                        padding: '8px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5f5f5',
                        marginLeft: '10px'
                    }}>
                        <span>Detected: {preview}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrawingPad;