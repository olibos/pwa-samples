import {
  useRef,
  useState,
} from 'react';

import Classes from './camera.module.scss';

export default function Camera()
{
    let image = useRef<HTMLImageElement>(null);
    let video = useRef<HTMLVideoElement>(null);
    const [resolution, setResolution] = useState<number[]>()
    async function capture()
    {
      try{
        const picture = image.current;
        const mediaStream = await navigator.mediaDevices.getUserMedia({video: {width:{ideal:2000},height:{ideal:2000}}});
        /*
        
         */
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const {width:{max: imageWidth}, height:{max: imageHeight}} = capabilities;
         const imageCapture = new ImageCapture(track);
        // const {imageWidth:{max:imageWidth}, imageHeight:{max:imageHeight}} = await imageCapture.getPhotoCapabilities();
        //const {imageWidth, imageHeight} = await imageCapture.getPhotoSettings();
        setResolution([imageWidth, imageHeight]);
        const photo = await imageCapture.takePhoto();
        const url = URL.createObjectURL(photo);
        console.info("Media", {mediaStream, track, capabilities, imageCapture});
        picture.style.display = "block";
        picture.src = url;
        picture.addEventListener('load', () => URL.revokeObjectURL(url), {once: true});
        video.current.srcObject = mediaStream;
        video.current.addEventListener('error', e => console.error('Error', e))
      }catch(e)
      {
        console.error('Error', e);
      }
    }

    function show(e:React.ChangeEvent<HTMLInputElement>)
    {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        const img = image.current;
        const resolutionImage = new Image();
        resolutionImage.addEventListener('load', () => 
        {
          //URL.revokeObjectURL(url)
          setResolution([resolutionImage.width, resolutionImage.height]);
        }, {once: true});
        
        resolutionImage.src = img.src = url;
    }

    const builtIn = useRef<HTMLInputElement>();
    return (
      <>
        <h1>Camera</h1>
        <button type="button" onClick={() => builtIn.current.click()}>App Camera</button>
        <input type="file" accept="image/*" capture="environment" onChange={show} ref={builtIn} style={{display:'none'}}></input>
        <hr />
        { resolution && <div>Resolution: {resolution[0]}x{resolution[1]}</div>}
        <img ref={image} onClick={capture} className={Classes.image} alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQ4IDQ4IiBoZWlnaHQ9IjQ4cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQzLDQxSDVjLTIuMjA5LDAtNC0xLjc5MS00LTRWMTVjMC0yLjIwOSwxLjc5MS00LDQtNGgxbDAsMGMwLTEuMTA0LDAuODk2LTIsMi0yICBoMmMxLjEwNCwwLDIsMC44OTYsMiwyaDJjMCwwLDEuMTI1LTAuMTI1LDItMWwyLTJjMCwwLDAuNzgxLTEsMi0xaDhjMS4zMTIsMCwyLDEsMiwxbDIsMmMwLjg3NSwwLjg3NSwyLDEsMiwxaDkgIGMyLjIwOSwwLDQsMS43OTEsNCw0djIyQzQ3LDM5LjIwOSw0NS4yMDksNDEsNDMsNDF6IE00NSwxNWMwLTEuMTA0LTAuODk2LTItMi0ybC05LjIyMS0wLjAxM2MtMC4zMDUtMC4wMzMtMS44ODktMC4yNjktMy4xOTMtMS41NzMgIGwtMi4xMy0yLjEzbC0wLjEwNC0wLjE1MUMyOC4zNTEsOS4xMzIsMjguMTk2LDksMjgsOWgtOGMtMC4xNTMsMC0wLjM3NSwwLjE3OC0wLjQyNCwwLjIzMWwtMC4wNzUsMC4wOTZsLTIuMDg3LDIuMDg2ICBjLTEuMzA1LDEuMzA1LTIuODg5LDEuNTQtMy4xOTMsMS41NzNsLTQuMTUxLDAuMDA2QzEwLjA0NiwxMi45OTQsMTAuMDIzLDEzLDEwLDEzSDhjLTAuMDE0LDAtMC4wMjYtMC4wMDQtMC4wNC0wLjAwNEw1LDEzICBjLTEuMTA0LDAtMiwwLjg5Ni0yLDJ2MjJjMCwxLjEwNCwwLjg5NiwyLDIsMmgzOGMxLjEwNCwwLDItMC44OTYsMi0yVjE1eiBNMjQsMzdjLTYuMDc1LDAtMTEtNC45MjUtMTEtMTFzNC45MjUtMTEsMTEtMTEgIHMxMSw0LjkyNSwxMSwxMVMzMC4wNzUsMzcsMjQsMzd6IE0yNCwxN2MtNC45NzEsMC05LDQuMDI5LTksOXM0LjAyOSw5LDksOXM5LTQuMDI5LDktOVMyOC45NzEsMTcsMjQsMTd6IE0yNCwzMSAgYy0yLjc2MiwwLTUtMi4yMzgtNS01czIuMjM4LTUsNS01czUsMi4yMzgsNSw1UzI2Ljc2MiwzMSwyNCwzMXogTTI0LDIzYy0xLjY1NiwwLTMsMS4zNDQtMywzYzAsMS42NTcsMS4zNDQsMywzLDMgIGMxLjY1NywwLDMtMS4zNDMsMy0zQzI3LDI0LjM0NCwyNS42NTcsMjMsMjQsMjN6IE0xMCwxOUg2Yy0wLjU1MywwLTEtMC40NDctMS0xdi0yYzAtMC41NTIsMC40NDctMSwxLTFoNGMwLjU1MywwLDEsMC40NDgsMSwxdjIgIEMxMSwxOC41NTMsMTAuNTUzLDE5LDEwLDE5eiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" />
        <hr />
        <video ref={video} autoPlay />
      </>  
    );
}