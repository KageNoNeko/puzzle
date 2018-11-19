import { parse } from 'query-string';
import './images/steve.jpg';
import { App } from './app/app';

const urlParams = parse(window.location.search);
if (urlParams[ 'url' ] || urlParams[ 'path' ] || urlParams[ 'local' ]) {

    const app = new App({
                            width: 800,
                            height: 600,
                            backgroundColor: 0x1099bb,
                            autoResize: true,
                            resolution: window.devicePixelRatio || 1
                        });

    document.body.appendChild(app.view);

    app.maximize();
    app.play(<string>urlParams[ 'url' ] || (urlParams[ 'path' ] ? `https://upload.wikimedia.org/${urlParams[ 'path' ]}` : `/images/${urlParams[ 'local' ]}`));

    window.addEventListener('resize', () => app.maximize());
} else {

    document.body.innerHTML = '<h5>No puzzle</h5><p>Try to add one of next URL params:</p><pre>?url=&lt;image URL&gt;</pre><pre>?path=&lt;image URL path on https://upload.wikimedia.org/&gt;</pre><pre>?local=steve.jpg</pre>';
}