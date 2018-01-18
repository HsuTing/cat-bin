// @flow
'use strict';

import ip from 'ip';

export default (): void => {
  console.log(ip.address());
};
