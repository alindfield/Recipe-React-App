import React from 'react';
import classes from './RecipeSummary.css';
import {useDispatch, useSelector} from 'react-redux';
import * as actionCreators from '../../../store/reducers/index';

const Recipe = (props) => {

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
    
    const media = mediaState.medias[props.recipe.id] ? <div className={classes.Media} ref={ref}><img src={mediaState.medias[props.recipe.id]} alt=""/></div> : null;

    return (
        <div className={classes.Recipe} onMouseEnter={() => mouseEnterHandler(props.id)} onMouseLeave={mouseLeaveHandler} onClick={() => props.clicked(props.recipe.id)}>
            <div className={classes.Detail}>
                <div className={classes.Field}>
                    <input className={classes.Title} readOnly type="text" value={props.recipe.title}></input>
                </div>
                {props.recipe.description
                    ? 
                        <div className={classes.Field}>
                            <textarea className={classes.Title} readOnly value={props.recipe.description}></textarea>
                        </div>
                    :
                        null
                }
            </div>
            {media}
        </div>
    );

};

export default Recipe;
