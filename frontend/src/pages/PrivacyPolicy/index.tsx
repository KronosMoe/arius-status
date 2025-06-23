import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPolicy() {
  const sections = [
    { id: "interpretation", title: "Interpretation and Definitions" },
    { id: "collecting", title: "Collecting and Using Your Personal Data" },
    { id: "retention", title: "Retention of Your Personal Data" },
    { id: "transfer", title: "Transfer of Your Personal Data" },
    { id: "delete", title: "Delete Your Personal Data" },
    { id: "disclosure", title: "Disclosure of Your Personal Data" },
    { id: "security", title: "Security of Your Personal Data" },
    { id: "children", title: "Children's Privacy" },
    { id: "links", title: "Links to Other Websites" },
    { id: "changes", title: "Changes to this Privacy Policy" },
    { id: "contact", title: "Contact Us" },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Table of Contents</h3>
                <ScrollArea className="h-[400px]">
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-sm hover:bg-slate-100 rounded px-3 py-2 transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-8 lg:p-12">
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Badge variant="outline" className="border-blue-200">
                      AriusCloud
                    </Badge>
                    <Badge variant="outline" className="border-green-200">
                      Last updated: June 23, 2025
                    </Badge>
                  </div>
                  <div className="max-w-3xl mx-auto">
                    <p className="text-lg leading-relaxed">
                      This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of
                      Your information when You use the Service and tells You about Your privacy rights and how the law
                      protects You.
                    </p>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Introduction */}
                <div className="prose max-w-none mb-8">
                  <p className="leading-relaxed">
                    We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
                    collection and use of information in accordance with this Privacy Policy. This Privacy Policy has
                    been created with the help of the{" "}
                    <a
                      href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Free Privacy Policy Generator
                    </a>
                    .
                  </p>
                </div>

                {/* Interpretation and Definitions */}
                <section id="interpretation" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Interpretation and Definitions</h2>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Interpretation</h3>
                    <p className="leading-relaxed">
                      The words of which the initial letter is capitalized have meanings defined under the following
                      conditions. The following definitions shall have the same meaning regardless of whether they
                      appear in singular or in plural.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Definitions</h3>
                    <p className="mb-4">For the purposes of this Privacy Policy:</p>

                    <div className="grid gap-4">
                      {[
                        {
                          term: "Account",
                          definition:
                            "means a unique account created for You to access our Service or parts of our Service.",
                        },
                        {
                          term: "Affiliate",
                          definition:
                            "means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.",
                        },
                        {
                          term: "Company",
                          definition:
                            "(referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to AriusCloud.",
                        },
                        {
                          term: "Cookies",
                          definition:
                            "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                        },
                        { term: "Country", definition: "refers to: Thailand" },
                        {
                          term: "Device",
                          definition:
                            "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                        },
                        {
                          term: "Personal Data",
                          definition: "is any information that relates to an identified or identifiable individual.",
                        },
                        { term: "Service", definition: "refers to the Website." },
                        {
                          term: "Service Provider",
                          definition:
                            "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
                        },
                        {
                          term: "Usage Data",
                          definition:
                            "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
                        },
                        { term: "Website", definition: "refers to AriusCloud, accessible from https://arius.cloud" },
                        {
                          term: "You",
                          definition:
                            "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                        },
                      ].map((item, index) => (
                        <Card key={index} className="">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Badge variant="secondary" className="w-fit font-semibold">
                                {item.term}
                              </Badge>
                              <p className="text-sm leading-relaxed">{item.definition}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>

                <Separator className="mb-8" />

                {/* Collecting and Using Your Personal Data */}
                <section id="collecting" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Collecting and Using Your Personal Data</h2>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Types of Data Collected</h3>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-3">Personal Data</h4>
                      <p className="mb-4 leading-relaxed">
                        While using Our Service, We may ask You to provide Us with certain personally identifiable
                        information that can be used to contact or identify You. Personally identifiable information may
                        include, but is not limited to:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Email address</Badge>
                        <Badge variant="outline">Usage Data</Badge>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-3">Usage Data</h4>
                      <div className="space-y-4 leading-relaxed">
                        <p>Usage Data is collected automatically when using the Service.</p>
                        <p>
                          Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g.
                          IP address), browser type, browser version, the pages of our Service that You visit, the time
                          and date of Your visit, the time spent on those pages, unique device identifiers and other
                          diagnostic data.
                        </p>
                        <p>
                          When You access the Service by or through a mobile device, We may collect certain information
                          automatically, including, but not limited to, the type of mobile device You use, Your mobile
                          device unique ID, the IP address of Your mobile device, Your mobile operating system, the type
                          of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                        </p>
                        <p>
                          We may also collect information that Your browser sends whenever You visit our Service or when
                          You access the Service by or through a mobile device.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-3">Tracking Technologies and Cookies</h4>
                      <div className="space-y-4 leading-relaxed">
                        <p>
                          We use Cookies and similar tracking technologies to track the activity on Our Service and
                          store certain information. Tracking technologies used are beacons, tags, and scripts to
                          collect and track information and to improve and analyze Our Service.
                        </p>

                        <div className="grid gap-4">
                          <Card className="">
                            <CardContent className="p-4">
                              <h5 className="font-semibold mb-2">Cookies or Browser Cookies</h5>
                              <p className="text-sm">
                                A cookie is a small file placed on Your Device. You can instruct Your browser to refuse
                                all Cookies or to indicate when a Cookie is being sent.
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="">
                            <CardContent className="p-4">
                              <h5 className="font-semibold mb-2">Web Beacons</h5>
                              <p className="text-sm">
                                Small electronic files that permit the Company to count users who have visited pages or
                                opened emails.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Use of Your Personal Data</h3>
                    <p className="mb-4">The Company may use Personal Data for the following purposes:</p>

                    <div className="grid gap-3">
                      {[
                        "To provide and maintain our Service, including to monitor the usage of our Service.",
                        "To manage Your Account: to manage Your registration as a user of the Service.",
                        "For the performance of a contract: the development, compliance and undertaking of the purchase contract.",
                        "To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.",
                        "To provide You with news, special offers and general information about other goods, services and events.",
                        "To manage Your requests: To attend and manage Your requests to Us.",
                        "For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring.",
                        "For other purposes: We may use Your information for data analysis, identifying usage trends.",
                      ].map((purpose, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm leading-relaxed">{purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Additional sections with improved styling */}
                <section id="retention" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Retention of Your Personal Data</h2>
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      The Company will retain Your Personal Data only for as long as is necessary for the purposes set
                      out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to
                      comply with our legal obligations, resolve disputes, and enforce our legal agreements and
                      policies.
                    </p>
                    <p>
                      The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally
                      retained for a shorter period of time, except when this data is used to strengthen the security or
                      to improve the functionality of Our Service.
                    </p>
                  </div>
                </section>

                <Separator className="mb-8" />

                <section id="security" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Security of Your Personal Data</h2>
                  <Card className="">
                    <CardContent className="p-6">
                      <p className="leading-relaxed">
                        The security of Your Personal Data is important to Us, but remember that no method of
                        transmission over the Internet, or method of electronic storage is 100% secure. While We strive
                        to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its
                        absolute security.
                      </p>
                    </CardContent>
                  </Card>
                </section>

                <section id="children" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Children&apos;s Privacy</h2>
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                      identifiable information from anyone under the age of 13. If You are a parent or guardian and You
                      are aware that Your child has provided Us with Personal Data, please contact Us.
                    </p>
                    <p>
                      If We need to rely on consent as a legal basis for processing Your information and Your country
                      requires consent from a parent, We may require Your parent&apos;s consent before We collect and
                      use that information.
                    </p>
                  </div>
                </section>

                <section id="changes" className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Changes to this Privacy Policy</h2>
                  <div className="space-y-4 leading-relaxed">
                    <p>
                      We may update Our Privacy Policy from time to time. We will notify You of any changes by posting
                      the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of
                      this Privacy Policy.
                    </p>
                    <p>
                      You are advised to review this Privacy Policy periodically for any changes. Changes to this
                      Privacy Policy are effective when they are posted on this page.
                    </p>
                  </div>
                </section>

                <Separator className="mb-8" />

                {/* Contact Section */}
                <section id="contact" className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                  <Card className="">
                    <CardContent className="p-6">
                      <p className="mb-4">If you have any questions about this Privacy Policy, You can contact us:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Email</Badge>
                        <a href="mailto:mirailisclm@gmail.com" className="hover:underline font-medium">
                          mirailisclm@gmail.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Footer */}
                <div className="text-center pt-8 border-t">
                  <p className="text-sm">© 2025 AriusCloud. All rights reserved.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
