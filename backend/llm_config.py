LLM_CONFIG = {
    'tutor': {
        'model': 'gpt-4o',
        'temperature': 0.7,
        'max_tokens': 500,
        'style': 'teaching'
    },
    'validator': {
        'model': 'gpt-4o',  # Could be different model
        'temperature': 0.1,
        'max_tokens': 300,
        'style': 'technical'
    }
}