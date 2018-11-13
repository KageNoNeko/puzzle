import { Puzzle } from './Puzzle';

const app = new Puzzle(
    { rows: 10, columns: 10 },
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Inveraray_Castle_-_south-west_facade.jpg/1200px-Inveraray_Castle_-_south-west_facade.jpg',
    1200, 738, { backgroundColor: 0x1099bb });

document.body.appendChild(app.view);