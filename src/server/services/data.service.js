/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import dataRepository from '../models/repositories/data.repository.js';
import { decodeListOfNames } from '../../shared/utils/encoding.js';
import _ from 'lodash';

export const getFokoData = async (encodedNames) => {
    if (!encodedNames) {
        throw new Error("Missing parameter 'names'");
    }
    
    const decoded = decodeListOfNames(encodedNames);
    const rows = await dataRepository.findFoko(decoded);
    
    // work around the umlaut problems in MariaDB
    const filteredRows = _.filter(rows, x => _.includes(decoded, x.familyName));
    
    return filteredRows;
};

export default {
    getFokoData
};

