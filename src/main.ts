import { parse } from 'query-string';
import { App } from './app/app';
import { LazyApp } from './app/lazy-app';

const urlParams = parse(window.location.search),
    instructions: HTMLElement = document.querySelector('.instructions'),
    appClass = urlParams[ 'mode' ] && urlParams[ 'mode' ] === 'lazy' ? LazyApp : App;
if (urlParams[ 'url' ] || urlParams[ 'path' ] || urlParams[ 'local' ]) {

    document.body.removeChild(instructions);

    const app = new appClass({
                            width: 800,
                            height: 600,
                            backgroundColor: 0x1099bb,
                            autoResize: true,
                            resolution: window.devicePixelRatio || 1
                        });

    document.body.appendChild(app.view);

    app.maximize();
    app.play(<string>urlParams[ 'url' ] || (
        urlParams[ 'path' ] ? `https://upload.wikimedia.org/${urlParams[ 'path' ]}` : `./images/${urlParams[ 'local' ]}`
    ));

    window.addEventListener('resize', () => app.maximize());
} else {

    instructions.style.display = 'block';
}