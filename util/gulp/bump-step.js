/**
 * Gulp task that bumps and tags new versions
 */

const fs =      require('fs');
const semver =  require('semver');
const path =    require('path');
const git =     require('gulp-git');

module.exports = (gulp, rootDir) => {

  const pkgPath = '/package.json';

  const getPkgJson = () => {
    return JSON.parse(
      fs.readFileSync(
        path.join(rootDir, pkgPath),
        'utf8'
      )
    );
  };

  const updatePkgJson = (version) => {
    const pkgJson = getPkgJson();

    pkgJson.version = version;

    fs.writeFileSync(
      path.join(rootDir, '/package.json'),
      JSON.stringify(pkgJson, null, '\t')
    );
  };

  gulp.task('bump-patch', ['build'], () => {
    const newVer = semver.inc(getPkgJson().version, 'patch');

    updatePkgJson(newVer);

    return gulp
      .src(path.join(rootDir, pkgPath))
      .pipe(git.add())
      .pipe(git.commit(
        "Upgrading to " + newVer, { args: '--no-verify' }
      ))
      .on('end', () => {
        git.tag(newVer, 'Version Upgrade')
      });
  });

  gulp.task('bump-minor', [ 'build' ], () => {
    const newVer = semver.inc(getPkgJson().version, 'minor');

    updatePkgJson(newVer);

    return gulp
      .src(path.join(rootDir, pkgPath))
      .pipe(git.add())
      .pipe(git.commit(
        "Upgrading to " + newVer, { args: '--no-verify' }
      ))
      .on('end', () => {
        git.tag(newVer, 'Version Upgrade')
      });
  });

  gulp.task('bump-major', [ 'build' ], () => {
    const newVer = semver.inc(getPkgJson().version, 'major');

    updatePkgJson(newVer);

    return gulp
      .src(path.join(rootDir, pkgPath))
      .pipe(git.add())
      .pipe(git.commit(
        "Upgrading to " + newVer, { args: '--no-verify' }
      ))
      .on('end', () => {
        git.tag(newVer, 'Version Upgrade')
      });
  });

}
