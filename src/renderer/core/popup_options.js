export const $exit = {
    title: 'Are you want to exit?',
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes'
};

export const $empty_result = {
    title: 'Bad query',
    text: "There is no result for queried telemetry",
    type: 'info',
    showCancelButton: false
};

export const $error = (data = '') => {
    return {
        title: 'Oops...',
        text: `${data}`,
        type: 'error',
        showCancelButton: false
    };
};

export const $connection_error = {
    type: 'warning',
    title: 'The Internet things :(',
    text: 'No connection',
    showCancelButton: true,
    confirmButtonText: 'Retry'
};

export const $exception_message = (data) => {
    return {
        type: 'error',
        title: 'Something went wrong',
        text: `${data}`,
        showCancelButton: false
    };
};

export const $number_input = ({ title = '', inputValue = 0 }) => {
    return {
        title,
        input: "number",
        inputValue,
        inputValidator: value => {
            if (!value) {
                return "You need to write something!";
            }
        }
    };
};