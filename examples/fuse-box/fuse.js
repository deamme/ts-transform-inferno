const { FuseBox } = require('fuse-box');
const transformInferno = require('ts-transform-inferno').default

const fuse = FuseBox.init({
    homeDir: "src",
    output: "build/$name.js",
    cache: true,
    transformers: {
        before: [transformInferno()]
    }
});

fuse.dev()

fuse.bundle("app")
    .instructions(`>index.tsx`)
    .hmr()
    .watch()

fuse.run();