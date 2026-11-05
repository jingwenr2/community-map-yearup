import {mkdir,cp,rm,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const path of ['index.html','src','public']) await cp(path,`dist/${path}`,{recursive:true});
// One content version for the complete module graph prevents mixed cached releases.
const files=(await readdir('src')).filter(name=>/\.(js|css)$/.test(name)).sort();
const hash=createHash('sha256');
hash.update(await readFile('index.html'));
for(const file of files)hash.update(await readFile(`src/${file}`));
const version=hash.digest('hex').slice(0,12);
for(const file of files.filter(name=>name.endsWith('.js'))){
 const path=`dist/src/${file}`,source=await readFile(path,'utf8');
 await writeFile(path,source.replace(/(from\s+['"])(\.\/[^'"]+\.js)(['"])/g,`$1$2?v=${version}$3`));
}
const html=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',html.replace(/(\.\/src\/(?:app\.js|style\.css))(?=['"])/g,`$1?v=${version}`));
console.log(`Built static website in dist/ (asset version ${version})`);
