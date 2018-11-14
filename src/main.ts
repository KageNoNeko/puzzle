import { parse } from 'query-string';
import { Puzzle } from './Puzzle';

const urlParams = parse(window.location.search);
if (urlParams[ 'url' ] || urlParams[ 'path' ]) {

    const app = new Puzzle(
        { rows: 3, columns: 3 },
        // wikipedia/commons/thumb/b/bf/Inveraray_Castle_-_south-west_facade.jpg/1200px-Inveraray_Castle_-_south-west_facade.jpg
        <string>urlParams[ 'url' ] || `https://upload.wikimedia.org/${urlParams[ 'path' ]}`,
        1200, 738, { backgroundColor: 0x1099bb });

    document.body.appendChild(app.view);
} else {

    document.body.innerHTML = '<h5>No puzzle</h5><p>Try to add one of next URL params:</p><pre>?url=&lt;image URL&gt;</pre><pre>?path=&lt;image URL path on https://upload.wikimedia.org/&gt;</pre>';
}