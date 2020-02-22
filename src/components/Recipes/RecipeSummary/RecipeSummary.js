import React from 'react';
import './RecipeSummary.css';
import {useDispatch, useSelector} from 'react-redux';
import * as actionCreators from '../../../store/reducers/index';

const RecipeSummary = (props) => {

    const ref = React.createRef();
    const dispatch = useDispatch();
    const mediaState = useSelector(state => state.MED);

    const mouseEnterHandler = () => {
        if (props.recipe.imageId && !mediaState.medias[props.recipe.id]) {
            dispatch(actionCreators.getThumbnail(props.recipe.id, props.recipe.imageId));
        }
    };

    const mouseLeaveHandler = () => {
    };
    
    const media = mediaState.medias[props.recipe.id] ? <div className="recipesummary-media" ref={ref}><img src={mediaState.medias[props.recipe.id]} alt=""/></div> : null;

    return (
        <div className="recipesummary" onMouseEnter={() => mouseEnterHandler(props.id)} onMouseLeave={mouseLeaveHandler} onClick={() => props.clicked(props.recipe.id)}>
            <div className="recipesummary-detail">
                <div className="recipesummary-field">
                    <input className="recipesummary-title" readOnly type="text" value={props.recipe.title}></input>
                </div>
                {props.recipe.description
                    ? 
                        <div className="recipesummary-field">
                            <textarea className="recipesummary-title" readOnly value={props.recipe.description}></textarea>
                        </div>
                    :
                        null
                }
            </div>
            {media}
        </div>
    );

};

export default RecipeSummary;
