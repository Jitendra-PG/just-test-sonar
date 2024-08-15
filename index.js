console.log('Hello World')
console.log('Added from another brnach')
let a = 1
let b = 2
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')

if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')

if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')
if(a == b)
  console.log('Matched!')
else
  console.log('Not Matched!')


function abc(one, two, three, four, five, six, seven, eight, nine, ten) {
  return one
}

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs): Promise<JobSearchLoaderProps | TypedResponse> => {
    await requireRegistration(request);
    const url = new URL(request.url);
    const {
        searchQuery,
        cityQuery,
        employmentTypes,
        timeWindow,
        remoteType,
        resultLimit,
        resultPage,
        resultOrder,
        jobId,
        isMobile
    } = getAllSearchParams(url.searchParams);
    const citiesListBuffer = await fs.readFileSync(path.resolve('data/cities.json'), 'utf8');
    const citiesList = JSON.parse(citiesListBuffer);

    const user_Data = await getUserDataFromSession(request);
    const { userId, isSignedIn } = await getUserIdIfSignedIn(request);
    
    let selected_Job_Posting = {};

    if (url.searchParams.size == 0) {
        return {
            citiesList,
            cityQuery,
            searchQuery,
            employmentTypes,
            timeWindow,
            remoteType,
            resultPage,
            orderBy: DEFAULT_SORT_ORDER,
            totalRecords: 0,
            totalPages: 0,
            jobId: '',
            selectedJobPosting: {},
            jobDetailsList: [],
            userId,
            isSignedIn,
        };
    }

    const jobPostingDetails = await getJobPostings({
        keywords: searchQuery,
        cities: cityQuery ? [Number(cityQuery)] : [],
        employmentTypes,
        timeWindow,
        remoteTypes: remoteType ? [remoteType] : [],
        resultLimit: resultLimit ?? DEFAULT_PAGE_SIZE,
        resultPage: resultPage ?? 1,
        resultOrder
    });

    const jobDetailsList = [];
    for (const jobPosting of jobPostingDetails.jobPostingList) {
        const jobApplication = await getJobApplicationFromUserAccount(userData, jobPosting.id);
        const jobDetail = {...jobPosting, ...jobApplication};
        jobDetailsList.push(jobDetail);
    }

    if(jobId !== '' && jobDetailsList.length) {
        selectedJobPosting = jobDetailsList.find((element) => element.id == jobId) || jobDetailsList[0];
    }
    else if(jobId === '' && jobDetailsList.length && !isMobile) {
        const queryParams = new URLSearchParams({
            jobId: jobDetailsList[0]?.id,
            searchQuery,
            cityQuery,
            employmentTypes: employmentTypes.join(','),
            timeWindow,
            remoteType,
            resultLimit: String(resultLimit ?? DEFAULT_PAGE_SIZE),
            resultPage: String(resultPage ?? 1),
            resultOrder: resultOrder[0] as string,
        }).toString();

        return redirect(`/job_search?${queryParams}`);
    }

    return {
        citiesList,
        cityQuery,
        searchQuery,
        employmentTypes,
        timeWindow,
        remoteType,
        orderBy: resultOrder[0],
        resultPage: jobPostingDetails.postingsMetadata.page,
        totalRecords: jobPostingDetails.postingsMetadata.totalRecords,
        totalPages: jobPostingDetails.postingsMetadata.totalPages,
        jobId,
        selectedJobPosting,
        jobDetailsList,
        userId,
        isSignedIn,
    };
};

