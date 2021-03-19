import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { checkbox } from './styles';

export default ({ setThumbPhoto, thumbPhoto, identifierOfPicture }) => {
    return (
        <div>
            {thumbPhoto.identifierOfPicture === identifierOfPicture
            ? <Icon style={checkbox} type="check" size={15} strokeWidth={2} onClick={() => setThumbPhoto({ identifierOfPicture })}/>
            : <div style={checkbox} onClick={() => setThumbPhoto({ identifierOfPicture })}></div>}
        </div>
    );
}
