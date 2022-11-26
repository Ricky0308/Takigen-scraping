

def modify_cond_dict(cond_dict):
    if "業種_カテゴリ" in cond_dict:
        cond_dict["業種(カテゴリ)"] = cond_dict["業種_カテゴリ"]
        del cond_dict["業種_カテゴリ"]
    if "業種_詳細" in cond_dict:
        cond_dict["業種(詳細)"] = cond_dict["業種_詳細"]
        del cond_dict["業種_詳細"]
    return cond_dict