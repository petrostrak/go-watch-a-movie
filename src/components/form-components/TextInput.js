const TextInput = (props) => {
    return (
        <div className='mb-3'>
            <label htmlFor={props.name} className='form-label'>
                {props.title}
            </label>
            <textarea 
                type={props.type}
                className='form-control'
                id={props.name}
                name={props.name}
                rows={'3'}
                onChange={props.handleChange}
                value={props.value}
                rows={props.rows}/>
        </div>
    );
};

export default TextInput;