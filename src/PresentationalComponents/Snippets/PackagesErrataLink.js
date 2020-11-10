import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export const PackagesErrataLink = (<TextContent>
    <Label>Description</Label>
    <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
        {truncate(row.attributes.description.replace(
            new RegExp('\\n(?=[^\\n])', 'g'),
            ''
        ), 570, handlePatchLink(entityTypes.advisories, row.id, 'Read more'))}
    </Text>
    <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
        text={'View packages and errata at access.redhat.com'} />
</TextContent>);
