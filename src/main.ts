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

    document.body.innerHTML = 'No puzzle';
}