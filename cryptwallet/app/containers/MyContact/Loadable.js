/**
 *
 * Asynchronously loads the component for MyContact
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
