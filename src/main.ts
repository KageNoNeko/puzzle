import { parse } from 'query-string';
import { Puzzle } from './Puzzle';
import './images/steve.jpg';

const urlParams = parse(window.location.search);
if (urlParams[ 'url' ] || urlParams[ 'path' ] || urlParams[ 'local' ]) {

    const app = new Puzzle(
        { rows: 3, columns: 3 },
        <string>urlParams[ 'url' ] || (urlParams[ 'path' ] ? `https://upload.wikimedia.org/${urlParams[ 'path' ]}` : `/images/${urlParams[ 'local' ]}`),
        { backgroundColor: 0x1099bb, autoResize: true, resolution: devicePixelRatio });

    document.body.appendChild(app.view);

    window.addEventListener('resize', () => app.toFullScreen());

    app.toFullScreen();
} else {

    document.body.innerHTML = '<h5>No puzzle</h5><p>Try to add one of next URL params:</p><pre>?url=&lt;image URL&gt;</pre><pre>?path=&lt;image URL path on https://upload.wikimedia.org/&gt;</pre><pre>?local=steve.jpg</pre>';
}