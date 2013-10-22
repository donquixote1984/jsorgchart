import json
import random
from django.http import HttpResponse
from django.shortcuts import render_to_response,RequestContext

images = """
0091cdc19467eb349cbf163c93a0e4f88f623ba2.jpg
0570ec2010d2471d62a7f3e9bc439ea47b9efd20.jpg
0884221e6f3bee813075614b1774543ec7f0c284.jpg
0cf4b29130de0a07b129666e2494cd7058ce260f.jpg
0d515b38810fbb4e8b1deabef82864599e50cb52.jpg
0f80ed9460d7f60b9776e298cb3ceb28ba47bcb3.jpg
19bce054698c5e5573d262cb6c9b043914fb5d8a.jpg
1ad17b846a60922f7e8d86e6076a6db3a5e0f957.jpg
1fc0b376d1a0886b8d38a32d537fe78a850a6744.jpg
2175dcce6746d588e802577a383df627c4812379.jpg
2f32499d37f8f89ffed60257b3a8ca9fa8a76eb4.jpg
3395638f965b6297bfcc54a9e194f40a6b1c056c.jpg
3e7ee8ba38e710385c232b80d55e8ede449d4b96.jpg
42b6e5567b34c8a5b5424eaa359c2499cb04f50d.jpg
49f6f5c8a4a88c0428115eaaa9693ca34c8b234b.jpg
4e095451ae2e42caec23752b958a17e3dc883ffa.jpg
547d655177f4f4af047832baf609f07461ebb09c.jpg
56b92efbe19cfda01008c831810e99e79bc30ff9.jpg
57944b63176240fd8517ee97ed2329a817edd974.jpg
5a0d1b49bed7d0d0ae87a6a979a44bb54359ee46.jpg
61e3e378b472aa24fef54f296883d79ab404323b.jpg
63ea70aaea353fa379ac558bdc2e567d52ddb951.jpg
730acd3f31b64aea2c876318f4fdf2812e53608e.jpg
76dd58c7456c3792b6c3c1f6463a329ec9b923f2.jpg
783b10c9598115f34fee543238c737087bd59730.jpg
7a681a4bfc2bf238a4363a26c56b179497dc8f3a.jpg
95a4b3069ecd7753f694533b4d5039c4f75cd3bd.jpg
981ead707b1e8b17b9f2c1ebcf209e8ee6475052.jpg
99fb9a7ec08adf9a0acab4664ebfda2ab797b833.jpg
a74049c2cab363a04af5a0c8544efab258826151.jpg
ac7a6db2fb94adc98e2fce60c793571338ba1a1d.jpg
ae250c13c864ff66613b870a5f8dbb4c2933e2a2.jpg
b3cb45e3c2c4dd4ac300638213f55cad90fe856c.jpg
be1a0ee66ee6c86742d51d67ea11449ee77d1b06.jpg
c0e571322eec181565f8dec182a1c86a3b8ba59e.jpg
ca3d74615ca92a0d8071b449bdae1444ecd6deb0.jpg
d14dffef9959e8cb7bd5ab6ab21c6fea78ca51e9.jpg
d634be7dc9f7b96e5a2c398866e7a247e55c1d4f.jpg
d989b92e81154a67185713683a1c0ca8cd2bcc5f.jpg
e30a5732000184d270213032e3749a14676c0f38.jpg
e34ca009b37f561249d36a61a5a35a2ea57f77cf.jpg
e7bac7c038eb223f98298f1647b2a12009e49cc0.jpg
e961f25f15f72559a5143b7c13353ab90f0b2102.jpg
e9a5c3b962d7c2496481cdf3fb31ac55b3f6b3f0.jpg
ebfa385a0e5c8196b639b06f125fdabfa8a13893.jpg
ece4459783a29bb468dc7ec7adf1ea5393c122c9.jpg
f23b7077eba8e62cd7f90ce1dd9be1c564fdf50c.jpg
f25e3fdf7af6d4b6be32b3d4786b082dcdd1c3ee.jpg
f2b85ecb7ae82302fb5468c4353fdf11c3c053fe.jpg
f68b4fe8a93e51294411c93671e0add896bec918.jpg
f77cf693c04d9b42f48ec5712fb9a6d4a478f9cc.jpg
fdc61aaed88784f93ed6ce7ed29d38b5f4aeebe4.jpg
"""
images_arr = images.split("\n")
name_arr = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n"]
def index(request):
	return render_to_response("org.html",{})
def home(request):
	arr = []
	for i in range(0,10):
		hash ={}
		r_index_name = random.randint(0,len(name_arr)-1)
		r_index_image = random.randint(0,len(images_arr)-1)
		hash["id"] = name_arr[r_index_name]
		hash["text"] = name_arr[r_index_name]
		hash["image"] =images_arr[r_index_image]
		arr.append(hash)
	return HttpResponse(json.dumps(arr),mimetype='application/javascript')
def first(request):
	hash ={}
	r_index_name = random.randint(0,len(name_arr)-1)
	r_index_image = random.randint(0,len(images_arr)-1)
	hash["id"] = name_arr[r_index_name]
	hash["text"] = name_arr[r_index_name]
	hash["image"] =images_arr[r_index_image]			
	return HttpResponse(json.dumps(hash))
		
