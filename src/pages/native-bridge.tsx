import {
  useEffect,
  useState,
} from 'react';

export default function NativeBridge()
{
    const [code, setCode] = useState<string>();
    useEffect(()=> 
    {
        try
        {
            setCode(new URLSearchParams(location.search).get('code'));
        }catch(e)
        {
            console.error(e);
        }
    },  []);

    const scan = () => window.open(`zxing://scan/?ret=${encodeURIComponent(new URL('?code={CODE}', location.toString()).toString())}&SCAN_FORMATS=UPC_A,EAN_13`);
    return (
        <>
            <button type="button" onClick={scan}>Scan</button>
            <hr />
            {code && <div>Code: {code}</div>}
        </>
    )
}