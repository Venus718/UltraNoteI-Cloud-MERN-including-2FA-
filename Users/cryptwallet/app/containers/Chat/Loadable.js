/**
 *
 * Asynchronously loads the component for Chat
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
