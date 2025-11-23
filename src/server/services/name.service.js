/*
 * (c) 2016, Jörn Dinkla, http://www.dinkla.net
 *
 * see the file LICENSE in the root directory for license information
 */

import nameRepository from '../models/repositories/name.repository.js';
import _ from 'lodash';

export const searchExact = async (familyname) => {
    if (!familyname) {
        throw new Error('Family name is required');
    }
    
    const rows = await nameRepository.findExact(familyname);
    return _.map(rows, e => e.familyname);
};

export const searchLike = async (pattern) => {
    if (!pattern || pattern.length < 4) {
        throw new Error('Pattern has to have a minimal length of 4 characters');
    }
    
    const rows = await nameRepository.findLike(pattern);
    return _.map(rows, e => e.familyname);
};

export const searchRegexp = async (pattern) => {
    if (!pattern || pattern.length < 4) {
        throw new Error('Pattern has to have a minimal length of 4 characters');
    }
    
    const rows = await nameRepository.findRegexp(pattern);
    return _.map(rows, e => e.familyname);
};

export default {
    searchExact,
    searchLike,
    searchRegexp
};

