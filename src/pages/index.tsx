import Link from 'next/link';

export default function Samples()
{
    return (
        <>
            <h1>Proof of concepts</h1>
            <h2>Pourquoi ?</h2>
            <p>Comme une image vaut mieut qu'un long discours, il est souvent plus simple de comprendre certain concepts en les montrants.</p>
            <fieldset>
                <legend>Samples</legend>
                <div>
                    <ul>
                        <li>
                            <Link href="/camera">
                                <a>Camera</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/native-bridge">
                                <a>Bridge natif</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/mobile-detection">
                                <a>Mobile detection</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/serial">
                                <a>Serial port (and serial over bluetooth)</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </fieldset>

            <fieldset>
                <legend>Idées</legend>
                <div>
                    <ul>
                        <li>
                            Synchro
                            <ul>
                                <li>Background Sync</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </fieldset>
        </>
    );
}