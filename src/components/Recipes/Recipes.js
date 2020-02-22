import React from 'react'
import RecipeSummary from './RecipeSummary/RecipeSummary';
import classes from './Recipes.css';

const recipes = (props) => {

    let output = <p>No records selected</p>;

    if (props.recipes && props.recipes !== null && props.recipes.length >= 1) {
        if (props.recipes instanceof Array) {
            output = props.recipes.map(recipe => {
                return <RecipeSummary id={recipe.id} key={recipe.id} recipe={recipe} clicked={props.clicked}/>
            });
        } else {
            output = <RecipeSummary id={recipes.id} key={recipes.id} recipe={recipes} clicked={props.clicked}/>
        }
    }

    return (
        <div className={classes.Recipes}>
            {output}
        </div>
    );
}

export default recipes;