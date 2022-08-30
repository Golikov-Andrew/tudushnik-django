def get_obj_from_request_get(src_dict):
    __obj = {}
    for k, v in src_dict.items():
        k = k.replace('[', '.').replace(']', '')
        keys = k.split('.')
        if len(keys) == 1:
            __obj[keys[0]] = v
        else:
            cur_obj = __obj
            level = 1
            for cur_key in keys:
                if cur_key not in cur_obj:
                    cur_obj[cur_key] = dict()
                if level == len(keys):
                    cur_obj[cur_key] = v
                else:
                    cur_obj = cur_obj[cur_key]
                level += 1

    return __obj


if __name__ == '__main__':
    src_dict = {
        'limit': 5,
        'sort_order[project_id][rrr]': 'asc',
        'sort_order[project_id][ddd]': 'asc',
        'sort_order[title]': 'desc',
    }
    result = get_obj_from_request_get(src_dict)
    print(result)
