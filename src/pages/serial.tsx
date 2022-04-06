import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

export default function Serial()
{
    /* Avoid server rendering with frontend API. */
    const [isMounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const [port, setPort] = useState<SerialPort>();
    const [data, setData] = useState('');
    const [usbProductId, setUsbProductId] = useState(0);
    const [usbVendorId, setUsbVendorId] = useState(0);

    useEffect(() =>
    {
        if (!port)
        {
            return;
        }

        const currentPort = port;
        const reader = currentPort.readable.getReader();
        async function startRead()
        {
            const decoder = new TextDecoder();
            while (true)
            {
                try
                {
                    const { value, done } = await reader.read();
                    if (done)
                    {
                        return;
                    }

                    setData(d => decoder.decode(value) + d);
                } catch (e)
                {
                    if (e?.name === 'NetworkError')
                    {
                        alert('Connexion interrompue...');
                    }
                    else
                    {
                        alert('Unknown error...');
                        console.error('Unknown error...', e);
                    }

                    setPort(null);
                    return;
                }
            }
        }

        startRead();
        return () => 
        {
            // cleanup
            console.info('Cleanup serial');
            reader.cancel().then(() =>
            {
                reader.releaseLock()
                currentPort.close();
            });
        }
    }, [port])
    if (!isMounted)
    {
        return null;
    }

    async function connect(e: FormEvent)
    {
        e.preventDefault();
        try
        {
            let filters: SerialPortFilter[] = [];
            if (usbVendorId)
            {
                filters.push({
                    usbVendorId: usbVendorId,
                    usbProductId: usbProductId || undefined,
                });
            }

            let port = await navigator.serial.requestPort({ filters });
            await port.open({ baudRate: 9600 });
            setPort(port);
        } catch (e)
        {
            if (e?.name === 'NotFoundError')
            {
                alert('Aucun appareil sélectionné.');
            }
            else
            {
                alert('Unknown error...');
                console.error('Unknown error...', e);
            }
        }
    }

    return navigator.serial ?
        <>
            <h1>Web Serial API</h1>
            {!port ?
                <form onSubmit={connect}>
                    <fieldset>
                        <legend>Filtrage:</legend>
                        <div>
                            <label>
                                VendorId:<br />
                                <input type="number" value={usbVendorId} onChange={e => setUsbVendorId(e.currentTarget.valueAsNumber)} />
                            </label>
                        </div>
                        <div>
                            <label>
                                ProductId:<br />
                                <input type="number" value={usbProductId} onChange={e => setUsbProductId(e.currentTarget.valueAsNumber)} />
                            </label>
                        </div>
                    </fieldset>
                    <hr />
                    <button>Connect</button>
                </form> :
                <>
                    <fieldset>
                        <legend>Console: {JSON.stringify(port.getInfo())} <button onClick={() => setPort(null)}>❌</button></legend>
                        <pre style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>{data}</pre>
                    </fieldset>
                </>
            }
        </>
        :
        (
            <h1>Web Serial API: Indisponnible</h1>
        );
}